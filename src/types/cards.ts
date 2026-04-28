import { QueryKey } from "./variables";

export type CardProps<T> = {
  record: T,
  onEdit?: () => void,
  queryKey: QueryKey[]
}

export type SessionCardProps = {
  title: string;
  description: string;
  icon: string;
  colors: [string, string];
  navigateTo: string;
};