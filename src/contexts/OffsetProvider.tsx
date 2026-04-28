"use client";

import React, { createContext, useContext, useState } from "react";
import { OffsetUnit, QueryKey, UpdateOffsetUnitProcess } from "../types/variables";
import { wait } from "../misc/helpers";
import { CommonParentProps } from "../types/components";
import { OffsetContextProps } from "../types/context";

const OffsetContext = createContext<OffsetContextProps | undefined>(undefined);

export const OffsetProvider = ({ children }: CommonParentProps): React.JSX.Element => {
  const [offsetUnit, setOffsetUnit] = useState<OffsetUnit>({})

  const setOffsetUnitMap = (
    keys: QueryKey[],
    value: any
  ) => {
    setOffsetUnit((prev) => {
      const newState = { ...prev };
      let current: any = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        current[key] = { ...(current[key] ?? {}) };
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;

      return newState;
    });
  };

  const getOffsetUnitValue = (keys: QueryKey[]): number => keys.reduce<any>((acc, key) => acc?.[key], offsetUnit) || 0;

  const updateOffsetUnit = (keys: QueryKey[], process: UpdateOffsetUnitProcess) => {
    const prevValue = getOffsetUnitValue(keys)
    const step = process === UpdateOffsetUnitProcess.UP ? 1 : -1
    const value = prevValue + step

    setOffsetUnitMap(keys, value)
  }

  const resetOffsetUnit = async (keys: QueryKey[]) => {
    setOffsetUnitMap(keys, 0)
    await wait(100)
  }

  return (
    <OffsetContext.Provider
      value={{
        updateOffsetUnit,
        getOffsetUnit: getOffsetUnitValue,
        resetOffsetUnit
      }}
    >
      {children}
    </OffsetContext.Provider>
  );
};

export const useOffsetContext = () => {
  const CONTEXT = useContext(OffsetContext);
  return CONTEXT as OffsetContextProps;
};

export default OffsetProvider;
