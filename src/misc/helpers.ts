export const booleanToNumber = (value: boolean): number => {
  return value ? 1 : 0;
}

export const numberToBoolean = (value: number): boolean => {
  return value === 1;
}

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  let hh = date.getHours();
  const min = String(date.getMinutes()).padStart(2, '0');
  const ampm = hh >= 12 ? 'PM' : 'AM';

  hh = hh % 12;
  hh = hh === 0 ? 12 : hh;
  const hourStr = String(hh).padStart(2, '0');

  return `${yyyy}/${mm}/${dd} ${hourStr}:${min} ${ampm}`;
};


export const formatDate = (ioString: string): string => {
  const date = new Date(ioString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}/${mm}/${dd}`;
}

export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const clone = { ...obj };
  keys.forEach(key => delete clone[key]);
  return clone;
}