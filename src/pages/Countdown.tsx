import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, AppState, Platform, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Circle } from 'react-native-svg';
import AntIcon from 'react-native-vector-icons/AntDesign';
import framework from '../styles/framework';
import colors from '../styles/colors';
import Variables from '../styles/variables';
import { scheduleTimerDoneNotification, requestNotifPermission, cancelAllTimerNotifications, showNow } from '../native/notifications';
import { startNativeCountdown, stopNativeCountdown } from '../native/countdown';
import { formatHMS } from '../misc/helpers';
import { createTimerLog } from '../api/crud/timerLogs';
import CountdownList from '../components/CountdownList';

const R = 70;
const CIRC = 2 * Math.PI * R;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const Countdown: React.FC = () => {
  const [durationMs, setDurationMs] = useState(25 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [points, setPoints] = useState<string>('0');

  const [pickerDate, setPickerDate] = useState(() => {
    const now = new Date();
    const h = Math.floor(durationMs / 3600000);
    const m = Math.floor((durationMs % 3600000) / 60000);
    const s = Math.floor((durationMs % 60000) / 1000);
    now.setHours(h);
    now.setMinutes(m);
    now.setSeconds(s);
    now.setMilliseconds(0);
    return now;
  });

  const endAtRef = useRef<number | null>(null);
  const fgIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSaveLog = useCallback(async () => {
    try {
      const pts = parseInt(points, 10) || 0;
      const log = {
        duration: formatHMS(durationMs),
        type: 'countdown',
        points: pts,
      };
      await createTimerLog(log);
      Alert.alert('Saved', `Log saved with ${pts} points`);
    } catch (err) {
      console.error('[Countdown] Save log error', err);
    }
  }, [durationMs, points])

  const startForegroundTick = useCallback(() => {
    if (fgIntervalRef.current) clearInterval(fgIntervalRef.current);

    fgIntervalRef.current = setInterval(() => {
      if (endAtRef.current) {
        const msLeft = Math.max(0, endAtRef.current - Date.now());
        setRemainingMs(msLeft);

        if (msLeft <= 0) {
          clearInterval(fgIntervalRef.current!);
          fgIntervalRef.current = null;
          setIsRunning(false);
          setIsPaused(false);
          endAtRef.current = null;

          showNow('Time’s up!', 'Countdown finished.');
          handleSaveLog();
        }
      }
    }, 250);
  }, [handleSaveLog]);

  const clearFgInterval = () => {
    if (fgIntervalRef.current) clearInterval(fgIntervalRef.current);
    fgIntervalRef.current = null;
  };

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && isRunning && !isPaused && endAtRef.current) {
        setRemainingMs(Math.max(0, endAtRef.current - Date.now()));
      }
    });
    return () => sub.remove();
  }, [isRunning, isPaused]);

  useEffect(() => {
    requestNotifPermission();
  }, []);

  const progress = clamp(1 - remainingMs / Math.max(1, durationMs), 0, 1);

  const start = async () => {
    if (isRunning && !isPaused) return;
    const endAt = Date.now() + remainingMs;
    endAtRef.current = endAt;

    setIsRunning(true);
    setIsPaused(false);

    await cancelAllTimerNotifications();
    await scheduleTimerDoneNotification(endAt);

    startForegroundTick();
    startNativeCountdown(remainingMs);
  };

  const pause = async () => {
    if (!isRunning || isPaused) return;
    setIsPaused(true);
    clearFgInterval();
    if (endAtRef.current) {
      setRemainingMs(Math.max(0, endAtRef.current - Date.now()));
      endAtRef.current = null;
    }
    await stopNativeCountdown();
    await cancelAllTimerNotifications();
  };

  const resume = async () => {
    if (!isPaused) return;
    setIsPaused(false);

    const endAt = Date.now() + remainingMs;
    endAtRef.current = endAt;

    await cancelAllTimerNotifications();
    await scheduleTimerDoneNotification(endAt);

    startForegroundTick();
    startNativeCountdown(remainingMs);
  };

  const stop = async () => {
    setIsRunning(false);
    setIsPaused(false);
    endAtRef.current = null;
    clearFgInterval();
    await stopNativeCountdown();
    await cancelAllTimerNotifications();

    handleSaveLog();

    setRemainingMs(durationMs);
  };

  const onClockPress = () => {
    const h = Math.floor(durationMs / 3600000);
    const m = Math.floor((durationMs % 3600000) / 60000);
    const s = Math.floor((durationMs % 60000) / 1000);

    const now = new Date();
    now.setHours(h);
    now.setMinutes(m);
    now.setSeconds(s);
    now.setMilliseconds(0);
    setPickerDate(now);
    setPickerVisible(true);
  };

  const onPickerChange = (_event: any, selectedDate?: Date) => {
    setPickerVisible(false);
    if (!selectedDate) return;

    const h = selectedDate.getHours();
    const m = selectedDate.getMinutes();
    const s = selectedDate.getSeconds();

    const ms = (h * 3600 + m * 60 + s) * 1000;
    const safe = Math.max(ms, 1000);

    setDurationMs(safe);
    setRemainingMs(safe);
    setIsRunning(false);
    setIsPaused(false);
    endAtRef.current = null;
    setPickerDate(selectedDate);
  };

  const strokeDashoffset = CIRC * (1 - progress);

  return (
    <View style={[framework.bgBackground, framework.p4, framework.alignCenter, framework.flexOne]}>
      <TouchableOpacity style={[framework.my3, framework.flexCenter]} onPress={onClockPress}>
        <Svg height="180" width="180" viewBox="0 0 180 180">
          <Circle cx="90" cy="90" r={R} stroke={colors.lightGray} strokeWidth="10" fill="none" />
          <Circle
            cx="90"
            cy="90"
            r={R}
            stroke={Variables.mainColor}
            strokeWidth="10"
            strokeDasharray={`${CIRC} ${CIRC}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform="rotate(-90 90 90)"
          />
        </Svg>
        <Text style={[framework.fontExtraBold, framework.text2xl, framework.textDark, framework.absolute]}>
          {formatHMS(remainingMs)}
        </Text>
      </TouchableOpacity>

      <View style={[framework.w100, framework.flexRow, framework.itemsCenter, framework.mt4, framework.gap3]}>
        <Text style={[framework.fontBold, framework.textDark, framework.textLg]}>Points:</Text>

        <TextInput
          style={[framework.flexOne, framework.bgWhite, framework.border, framework.borderGray, framework.px4, framework.py2, framework.roundedLg, framework.shadowSm, framework.textDark, framework.textCenter]}
          placeholder="0"
          keyboardType="numeric"
          value={points}
          onChangeText={(text) => {
            const numeric = text.replace(/[^0-9]/g, '');
            setPoints(numeric);
          }}
          maxLength={5}
        />
      </View>

      <View style={[framework.w100, framework.mt2, framework.flexRow, framework.flexCenter, framework.gap3]}>
        {!isRunning && !isPaused && (
          <TouchableOpacity
            style={[framework.bgSuccess, framework.w75, framework.px4, framework.py3, framework.flexRow, framework.flexCenter, framework.gap1, framework.roundedMd]}
            onPress={start}
          >
            <AntIcon name="caretright" size={16} color={Variables.reversedTextColor} />
            <Text style={[framework.fontBold, framework.reversedText]}>Start</Text>
          </TouchableOpacity>
        )}

        {isRunning && !isPaused && (
          <>
            <TouchableOpacity
              style={[framework.bgWarning, framework.flexOne, framework.px4, framework.py3, framework.flexRow, framework.flexCenter, framework.gap1, framework.roundedMd]}
              onPress={pause}
            >
              <AntIcon name="pause" size={16} color={Variables.reversedTextColor} />
              <Text style={[framework.fontBold, framework.reversedText]}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[framework.bgDanger, framework.flexOne, framework.px4, framework.py3, framework.flexRow, framework.flexCenter, framework.gap1, framework.roundedMd]}
              onPress={stop}
            >
              <AntIcon name="close" size={16} color={Variables.reversedTextColor} />
              <Text style={[framework.fontBold, framework.reversedText]}>Stop</Text>
            </TouchableOpacity>
          </>
        )}

        {isPaused && (
          <>
            <TouchableOpacity
              style={[framework.bgSuccess, framework.flexOne, framework.px4, framework.py3, framework.flexRow, framework.flexCenter, framework.gap1, framework.roundedMd]}
              onPress={resume}
            >
              <AntIcon name="caretright" size={16} color={Variables.reversedTextColor} />
              <Text style={[framework.fontBold, framework.reversedText]}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[framework.bgDanger, framework.flexOne, framework.px4, framework.py3, framework.flexRow, framework.flexCenter, framework.gap1, framework.roundedMd]}
              onPress={stop}
            >
              <AntIcon name="close" size={16} color={Variables.reversedTextColor} />
              <Text style={[framework.fontBold, framework.reversedText]}>Stop</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {pickerVisible && Platform.OS === 'android' && (
        <DateTimePicker
          value={pickerDate}
          mode="time"
          display="spinner"
          is24Hour
          onChange={onPickerChange}
          // @ts-ignore (secondsInterval not typed)
          secondsInterval={1}
        />
      )}

      <CountdownList />
    </View>
  );
};

export default Countdown;
