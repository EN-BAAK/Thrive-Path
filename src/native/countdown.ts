import { NativeModules } from 'react-native';
const { CountdownModule } = NativeModules;

export function startNativeCountdown(durationMs: number) {
  const endAt = Date.now() + durationMs;
  CountdownModule.startCountdown(endAt);
}

export function stopNativeCountdown() {
  CountdownModule.stopCountdown();
}
