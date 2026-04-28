"use client";

import React, { createContext, useContext, useState } from "react";
import { AppContextProps } from "../types/context";
import Warning from "../components/Warning";
import { CommonParentProps } from "../types/components";
import { ToastMessage, Warning as WarningType } from "../types/variables";
import Toast from "../components/Toast";
import { View } from "react-native";
import framework from "../styles/framework";

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: CommonParentProps): React.JSX.Element => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [warning, setWarning] = useState<WarningType | undefined>(undefined);

  const pushToast = (toastMessage: ToastMessage) => {
    setToasts((prev) => [...prev, toastMessage]);
  };

  const removeToast = (index: number) => {
    setToasts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AppContext.Provider
      value={{
        pushToast,
        showWarning: (warningProps) => setWarning(warningProps),
      }}
    >
      <View style={[framework.w100, framework.gap3, framework.absolute, framework.indexTop, { left: 15, top: 80 }]}>
        {toasts.map((toast, i) => (
          <Toast
            key={i}
            toast={toast}
            onClose={() => removeToast(i)}
          />
        ))}
      </View>

      {warning && (
        <Warning
          onClose={() => setWarning(undefined)}
          warning={warning}
        />
      )}

      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const CONTEXT = useContext(AppContext);
  return CONTEXT as AppContextProps;
};

export default AppProvider;
