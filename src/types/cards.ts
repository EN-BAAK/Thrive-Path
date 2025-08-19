export type CardProps<T> = {
  record: T,
  onSuccess?: () => void,
  onEdit?: () => void,
}

export type SessionCardProps = {
  title: string;
  description: string;
  icon: string;
  colors: [string, string];
  navigateTo: string;
};