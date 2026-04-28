import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfiniteAPIResponse, QueryKey, ToastMessageType, UpdateOffsetUnitProcess } from "../types/variables";
import { useOffsetContext } from "../contexts/OffsetProvider";
import { useAppContext } from "../contexts/AppProvider";
import { Subtask, TaskWithCategoryAndSubtasks } from "../types/schemas";
import { createSubtask, deleteSubtask, updateSubtaskCompletedById, updateSubtaskImportantById } from "../api/crud/tasks";

export const useCreateSubTask = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext()
  const { pushToast } = useAppContext()

  const onSuccess = (data: Subtask | null) => {
    if (!data)
      return;

    queryClient.setQueryData<InfiniteAPIResponse<TaskWithCategoryAndSubtasks>>(key, (oldData) => {
      if (!oldData) return oldData;

      updateOffsetUnit(key, UpdateOffsetUnitProcess.UP);

      const pageIndex = oldData.pages.findIndex(page =>
        page.data.some(task => task.id === data.parentTaskId)
      );
      if (pageIndex === -1) return oldData;

      const page = oldData.pages[pageIndex];

      const taskIndex = page.data.findIndex(task => task.id === data.parentTaskId);
      if (taskIndex === -1) return oldData;

      const task = page.data[taskIndex];

      const updatedTask = {
        ...task,
        subtasks: [...(task.subtasks || []), data],
      };

      const updatedPage = {
        ...page,
        data: [
          ...page.data.slice(0, taskIndex),
          updatedTask,
          ...page.data.slice(taskIndex + 1),
        ],
      };

      return {
        ...oldData,
        pages: oldData.pages.map((p, i) =>
          i === pageIndex ? updatedPage : p
        ),
      };
    });
    pushToast({ type: ToastMessageType.SUCCESS, message: "Subtask created successfully!" })
  };

  const onError = () => {
    pushToast({ type: ToastMessageType.FAILED, message: "Failed to create subtask" })
  }

  return useMutation({
    mutationFn: createSubtask,
    onSuccess,
    onError
  });
};

export const useRemoveSubtask = ({ key }: { key: QueryKey[] }) => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext();
  const { pushToast } = useAppContext();

  const onSuccess = (data: Subtask | null) => {
    if (!data) return;

    queryClient.setQueryData<InfiniteAPIResponse<TaskWithCategoryAndSubtasks>>(
      key,
      (oldData) => {
        if (!oldData) return oldData;

        const pageIndex = oldData.pages.findIndex((page) =>
          page.data.some((task) => task.id === data.parentTaskId)
        );

        if (pageIndex === -1) return oldData;

        const page = oldData.pages[pageIndex];

        const taskIndex = page.data.findIndex(
          (task) => task.id === data.parentTaskId
        );

        if (taskIndex === -1) return oldData;

        const task = page.data[taskIndex];

        updateOffsetUnit(key, UpdateOffsetUnitProcess.DOWN);

        const updatedTask = {
          ...task,
          subtasks: (task.subtasks || []).filter(
            (subtask) => subtask.id !== data.id
          ),
        };

        const updatedPage = {
          ...page,
          data: [
            ...page.data.slice(0, taskIndex),
            updatedTask,
            ...page.data.slice(taskIndex + 1),
          ],
        };

        return {
          ...oldData,
          pages: oldData.pages.map((p, i) =>
            i === pageIndex ? updatedPage : p
          ),
        };
      }
    );

    pushToast({
      type: ToastMessageType.SUCCESS,
      message: "Subtask removed successfully!",
    });
  };

  const onError = () => {
    pushToast({
      type: ToastMessageType.FAILED,
      message: "Failed to remove subtask",
    });
  };

  return useMutation({
    mutationFn: deleteSubtask,
    onSuccess,
    onError,
  });
};

export const useUpdateSubtaskImportance = ({ key, }: { key: QueryKey[]; }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  const onSuccess = (data: Subtask | null) => {
    if (!data) return;

    queryClient.setQueryData<InfiniteAPIResponse<TaskWithCategoryAndSubtasks>>(
      key,
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((task) => {
              if (task.id !== data.parentTaskId) return task;

              return {
                ...task,
                subtasks: (task.subtasks || []).map((subtask) =>
                  subtask.id === data.id
                    ? {
                      ...subtask,
                      isImportant: !subtask.isImportant,
                    }
                    : subtask
                ),
              };
            }),
          })),
        };
      }
    );

    pushToast({
      type: ToastMessageType.SUCCESS,
      message: "Subtask importance updated successfully!",
    });
  };

  const onError = () => {
    pushToast({
      type: ToastMessageType.FAILED,
      message: "Failed to update subtask importance",
    });
  };

  return useMutation({
    mutationFn: updateSubtaskImportantById,
    onSuccess,
    onError,
  });
};

export const useUpdateSubtaskCompleted = ({ key, }: { key: QueryKey[]; }) => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  const onSuccess = (data: Subtask | null) => {
    if (!data) return;

    queryClient.setQueryData<InfiniteAPIResponse<TaskWithCategoryAndSubtasks>>(
      key,
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((task) => {
              if (task.id !== data.parentTaskId) return task;

              return {
                ...task,
                subtasks: (task.subtasks || []).map((subtask) =>
                  subtask.id === data.id
                    ? {
                      ...subtask,
                      isCompleted: !subtask.isCompleted,
                    }
                    : subtask
                ),
              };
            }),
          })),
        };
      }
    );

    pushToast({
      type: ToastMessageType.SUCCESS,
      message: "Subtask completion updated successfully!",
    });
  };

  const onError = () => {
    pushToast({
      type: ToastMessageType.FAILED,
      message: "Failed to update subtask completion",
    });
  };

  return useMutation({
    mutationFn: updateSubtaskCompletedById,
    onSuccess,
    onError,
  });
};