export type CardProps<T> = {
  record: T,
  onSuccess?: () => void,
  onEdit?: () => void,
}