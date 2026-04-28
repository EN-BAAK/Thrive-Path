import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOffsetContext } from "../contexts/OffsetProvider";
import { InfiniteAPIResponse, QueryKey, ToastMessageType, UpdateOffsetUnitProcess } from "../types/variables";
import { createTask, deleteTask, findAllTasks, updateTask, updateTaskImportantById, updateTaskIsCompletedById } from "../api/crud/tasks";
import { useAppContext } from "../contexts/AppProvider";
import { Task, TaskWithCategoryAndSubtasks } from "../types/schemas";

export const useGetPaginatedTasks = ({ limit, key }: { limit: number; key: QueryKey[] }) => {
  const { getOffsetUnit } = useOffsetContext()
  const offsetUnit = getOffsetUnit(key)

  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam }) => findAllTasks({ limit, offsetUnit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
    retry: false,
  });
};

export const useCreateTask = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext()
  const { pushToast } = useAppContext()

  const onSuccess = (data: TaskWithCategoryAndSubtasks | null) => {
    if (!data)
      return;

    queryClient.setQueryData<InfiniteAPIResponse<TaskWithCategoryAndSubtasks>>(key, (oldData) => {
      if (!oldData) return oldData;
      updateOffsetUnit(key, UpdateOffsetUnitProcess.UP)
      return {
        ...oldData,
        pages: oldData.pages.map((page, index) =>
          index === 0 ? { ...page, data: [data, ...page.data] } : page
        ),
      };
    }
    )
    pushToast({ type: ToastMessageType.SUCCESS, message: "Task created successfully!" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to create task" })
  }

  return useMutation({
    mutationFn: createTask,
    onSuccess,
    onError
  });
};

export const useUpdateTask = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: TaskWithCategoryAndSubtasks | null) => {
    if (!data)
      return

    queryClient.setQueryData<InfiniteAPIResponse<TaskWithCategoryAndSubtasks>>(key, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((p) => p.id === data.id ? data : p)
        })),
      };
    }
    )

    pushToast({ type: ToastMessageType.SUCCESS, message: "Task updated successfully!" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to update task" })
  }

  return useMutation({
    mutationFn: updateTask,
    onSuccess,
    onError
  });
}

export const useUpdateIsImportantTask = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: Task) => {
    if (!data)
      return

    queryClient.setQueryData<InfiniteAPIResponse<TaskWithCategoryAndSubtasks>>(key, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((p) => p.id === data.id ? { ...p, isImportant: data.isImportant } : p)
        })),
      };
    }
    )
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to update task importance" })
  }

  return useMutation({
    mutationFn: updateTaskImportantById,
    onSuccess,
    onError
  });
}

export const useUpdateCompletingTask = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: Task) => {
    if (!data)
      return

    queryClient.setQueryData<InfiniteAPIResponse<TaskWithCategoryAndSubtasks>>(key, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((p) => p.id === data.id ? { ...p, isCompleted: data.isCompleted } : p)
        })),
      };
    }
    )
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to update task completing" })
  }

  return useMutation({
    mutationFn: updateTaskIsCompletedById,
    onSuccess,
    onError
  });
}

export const useDeleteTask = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext()
  const { pushToast } = useAppContext()

  const onSuccess = (data: Task) => {
    if (!data) return;
    queryClient.setQueryData<InfiniteAPIResponse<TaskWithCategoryAndSubtasks>>(key, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.filter(p => p.id !== data.id)
        })),
      };
    });

    updateOffsetUnit(key, UpdateOffsetUnitProcess.DOWN)
    queryClient.invalidateQueries({ queryKey: [...key, data.id] })
    pushToast({ type: ToastMessageType.SUCCESS, message: "Deleting task succeed!" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to delete task" })
  }

  return useMutation({
    mutationFn: deleteTask,
    onSuccess,
    onError
  });
};