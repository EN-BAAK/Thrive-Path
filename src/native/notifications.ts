import notifee, {
  TimestampTrigger,
  TriggerType,
  AndroidImportance,
} from '@notifee/react-native';

const TIMER_NOTIFICATION_ID = 'countdown-finished';
const TIMER_CHANNEL_ID = 'timer';

export async function ensureNotificationChannel() {
  await notifee.createChannel({
    id: TIMER_CHANNEL_ID,
    name: 'Timer',
    importance: AndroidImportance.HIGH,
  });
}

export async function requestNotifPermission() {
  await notifee.requestPermission();
  await ensureNotificationChannel();
}

export async function cancelAllTimerNotifications() {
  try {
    await notifee.cancelNotification(TIMER_NOTIFICATION_ID);
    await notifee.cancelTriggerNotification(TIMER_NOTIFICATION_ID);
  } catch (err) {
    console.error('[Notifications] Cancel error:', err);
  }
}

export async function scheduleTimerDoneNotification(
  when: number,
  title = 'Time’s up!',
  body = 'Your countdown finished.'
) {
  try {
    await cancelAllTimerNotifications();

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: when,
      alarmManager: {
        allowWhileIdle: true,
      },
    };

    return await notifee.createTriggerNotification(
      {
        id: TIMER_NOTIFICATION_ID,
        title,
        body,
        android: {
          channelId: TIMER_CHANNEL_ID,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher',
        },
      },
      trigger
    );
  } catch (err) {
    console.error('[Notifications] Schedule error:', err);
  }
}

export async function showNow(
  title: string,
  body?: string
) {
  try {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: TIMER_CHANNEL_ID,
        pressAction: {
          id: 'default',
        },
        smallIcon: 'ic_launcher',
      },
    });
  } catch (err) {
    console.error('[Notifications] Show error:', err);
  }
}