import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QueryKey, ToastMessageType } from "../types/variables";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../api/crud/categories";
import { Category } from "../types/schemas";
import { useAppContext } from "../contexts/AppProvider";

export const useGetCategories = ({ key, enabled = true }: { key: QueryKey[], enabled?: boolean }) => {
  return useQuery({ queryKey: key, queryFn: getCategories, enabled });
};

export const useCreateCategory = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: Category | null) => {
    if (!data)
      return;

    queryClient.setQueryData<Category[]>(key, (oldData) => {
      if (!oldData) return oldData;

      return [data, ...oldData]
    }
    )

    pushToast({ type: ToastMessageType.SUCCESS, message: "Category created successfully" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to create category" })
  }

  return useMutation({
    mutationFn: createCategory,
    onSuccess,
    onError
  });
};

export const useUpdateCategory = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: Category | null) => {
    if (!data)
      return

    queryClient.setQueryData<Category[]>(key, (oldData) => {
      if (!oldData) return oldData;

      const updatedData = oldData.map(c => c.id === data.id ? data : c)
      return updatedData

    })

    pushToast({ type: ToastMessageType.SUCCESS, message: "Category updated successfully" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to update category" })
  }

  return useMutation({
    mutationFn: updateCategory,
    onSuccess,
    onError
  });
}

export const useDeleteCategory = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: Category | null) => {
    if (!data) return;

    queryClient.setQueryData<Category[]>(key, (oldData) => {
      if (!oldData) return oldData;

      return oldData.filter(d => d.id !== data.id)
    });

    queryClient.invalidateQueries({ queryKey: [...key, data.id] })
    pushToast({ type: ToastMessageType.SUCCESS, message: "Category deleted successfully" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to delete category" })
  }

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess,
    onError
  });
};