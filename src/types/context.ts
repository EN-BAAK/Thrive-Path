import { QueryKey, ToastMessage, UpdateOffsetUnitProcess, Warning } from "./variables"

export type OffsetContextProps = {
  updateOffsetUnit: (keys: QueryKey[], process: UpdateOffsetUnitProcess) => void,
  getOffsetUnit: (keys: QueryKey[]) => number,
  resetOffsetUnit: (keys: QueryKey[]) => Promise<void>
}

export type AppContextProps = {
  pushToast: (toastMessage: ToastMessage) => void;
  showWarning: (warning: Warning) => void;
}
