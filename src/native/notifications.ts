import notifee, { TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';

export async function ensureNotificationChannel() {
  await notifee.createChannel({
    id: 'timer',
    name: 'Timer',
    importance: AndroidImportance.HIGH,
  });
}

export async function requestNotifPermission() {
  await notifee.requestPermission();
  await ensureNotificationChannel();
}

export async function cancelAllTimerNotifications() {
  await notifee.cancelAllNotifications();
  const scheduled = await notifee.getTriggerNotifications();
  for (const notif of scheduled) {
    if (notif.notification.id)
      await notifee.cancelTriggerNotification(notif.notification.id);
  }
}

export async function scheduleTimerDoneNotification(when: number, title = 'Time’s up!', body = 'Your countdown finished.') {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: when,
    alarmManager: { allowWhileIdle: true },
  };

  return await notifee.createTriggerNotification(
    {
      title,
      body,
      android: {
        channelId: 'timer',
        pressAction: { id: 'default' },
      },
    },
    trigger
  );
}

export async function showNow(title: string, body?: string) {
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: 'timer',
      pressAction: { id: 'default' },
    },
  });
}
