import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOffsetContext } from "../contexts/OffsetProvider";
import { InfiniteAPIResponse, QueryKey, ToastMessageType, UpdateOffsetUnitProcess } from "../types/variables";
import { addStar, createChallenge, deleteChallenge, deleteHeart, findAllChallenges, updateChallenge } from "../api/crud/challenges";
import { useAppContext } from "../contexts/AppProvider";
import { Challenge } from "../types/schemas";

export const useGetPaginatedChallenges = ({ limit, key }: { limit: number; key: QueryKey[] }) => {
  const { getOffsetUnit } = useOffsetContext()
  const offsetUnit = getOffsetUnit(key)

  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam }) => findAllChallenges({ limit, offsetUnit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
    retry: false,
  });
};

export const useCreateChallenge = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext()
  const { pushToast } = useAppContext()

  const onSuccess = (data: Challenge | null) => {
    if (!data)
      return;

    queryClient.setQueryData<InfiniteAPIResponse<Challenge>>(key, (oldData) => {
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
    pushToast({ type: ToastMessageType.SUCCESS, message: "Challenge created successfully!" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to create challenge" })
  }

  return useMutation({
    mutationFn: createChallenge,
    onSuccess,
    onError
  });
};

export const useUpdateChallenge = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: Challenge | null) => {
    if (!data)
      return

    queryClient.setQueryData<InfiniteAPIResponse<Challenge>>(key, (oldData) => {
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

    pushToast({ type: ToastMessageType.SUCCESS, message: "Challenge updated successfully!" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to update challenge" })
  }

  return useMutation({
    mutationFn: updateChallenge,
    onSuccess,
    onError
  });
}

export const useLoseHeart = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: Challenge) => {
    if (!data)
      return

    queryClient.setQueryData<InfiniteAPIResponse<Challenge>>(key, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((p) => p.id === data.id ? { ...p, currentHearts: data.currentHearts } : p)
        })),
      };
    }
    )
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to update challenge" })
  }

  return useMutation({
    mutationFn: deleteHeart,
    onSuccess,
    onError
  });
}

export const useAddStart = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext()

  const onSuccess = (data: Challenge) => {
    if (!data)
      return

    queryClient.setQueryData<InfiniteAPIResponse<Challenge>>(key, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((p) => p.id === data.id ? { ...p, currentStars: data.currentStars } : p)
        })),
      };
    }
    )
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to update challenge" })
  }

  return useMutation({
    mutationFn: addStar,
    onSuccess,
    onError
  });
}

export const useDeleteChallenge = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext()
  const { pushToast } = useAppContext()

  const onSuccess = (data: Challenge) => {
    if (!data) return;
    queryClient.setQueryData<InfiniteAPIResponse<Challenge>>(key, (oldData) => {
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
    pushToast({ type: ToastMessageType.SUCCESS, message: "Deleting challenge succeed!" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to delete challenge" })
  }

  return useMutation({
    mutationFn: deleteChallenge,
    onSuccess,
    onError
  });
};