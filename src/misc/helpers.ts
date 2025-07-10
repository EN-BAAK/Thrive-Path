export const booleanToNumber = (value: boolean): number => {
  return value ? 1 : 0;
}

export const numberToBoolean = (value: number): boolean => {
  return value === 1;
}