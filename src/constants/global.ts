import { ToastMessageType } from "../types/variables";

export const toastConfig: Record<ToastMessageType, any> = {
  SUCCESS: {
    icon: "check-circle",
    iconColor: "#16A34A",
    titleText: "Success",
    titleColor: "#15803D",
    messageColor: "#166534",
  },
  FAILED: {
    icon: "close-circle",
    iconColor: "#DC2626",
    titleText: "Error",
    titleColor: "#B91C1C",
    messageColor: "#7F1D1D",
  },
};