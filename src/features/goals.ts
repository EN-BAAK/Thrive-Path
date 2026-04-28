import { createGoal, deleteGoal, findAllGoals, updateGoal, updateGoalStatusById, updateIsImportantById } from "../api/crud/goals";
import { useOffsetContext } from "../contexts/OffsetProvider";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Goal, GoalWCategory } from "../types/schemas";
import { InfiniteAPIResponse, QueryKey, ToastMessageType, UpdateOffsetUnitProcess } from "../types/variables";
import { useAppContext } from "../contexts/AppProvider";

export const useGetPaginatedGoals = ({ limit, key }: { limit: number; key: QueryKey[] }) => {
  const { getOffsetUnit } = useOffsetContext()
  const offsetUnit = getOffsetUnit(key)

  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam }) => findAllGoals({ limit, offsetUnit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
    retry: false,
  });
};

export const useCreateGoal = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext()
  const { pushToast } = useAppContext()

  const onSuccess = (data: GoalWCategory | null) => {
    if (!data)
      return;

    queryClient.setQueryData<InfiniteAPIResponse<GoalWCategory>>(key, (oldData) => {
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
    pushToast({ type: ToastMessageType.SUCCESS, message: "Goal created successfully!" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to create goal" })
  }

  return useMutation({
    mutationFn: createGoal,
    onSuccess,
    onError
  });
};

export const useUpdateGoal = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: GoalWCategory | null) => {
    if (!data)
      return

    queryClient.setQueryData<InfiniteAPIResponse<GoalWCategory>>(key, (oldData) => {
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

    pushToast({ type: ToastMessageType.SUCCESS, message: "Goal updated successfully!" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to update goal" })
  }

  return useMutation({
    mutationFn: updateGoal,
    onSuccess,
    onError
  });
}

export const useUpdateIsImportantGoal = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: Goal) => {
    if (!data)
      return

    queryClient.setQueryData<InfiniteAPIResponse<GoalWCategory>>(key, (oldData) => {
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
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to update goal importance" })
  }

  return useMutation({
    mutationFn: updateIsImportantById,
    onSuccess,
    onError
  });
}

export const useUpdateStatusGoal = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: Goal) => {
    if (!data)
      return

    queryClient.setQueryData<InfiniteAPIResponse<GoalWCategory>>(key, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((p) => p.id === data.id ? { ...p, status: data.status } : p)
        })),
      };
    }
    )
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to update goal status" })
  }

  return useMutation({
    mutationFn: updateGoalStatusById,
    onSuccess,
    onError
  });
}

export const useDeleteGoal = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext()
  const { pushToast } = useAppContext()

  const onSuccess = (data: Goal) => {
    if (!data) return;
    queryClient.setQueryData<InfiniteAPIResponse<GoalWCategory>>(key, (oldData) => {
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
    pushToast({ type: ToastMessageType.SUCCESS, message: "Deleting goal succeed!" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to delete goal" })
  }

  return useMutation({
    mutationFn: deleteGoal,
    onSuccess,
    onError
  });
};