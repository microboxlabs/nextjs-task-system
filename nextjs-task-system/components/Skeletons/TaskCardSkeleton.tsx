const TaskCardSkeleton = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
      {/* Title */}
      <div className="mb-4 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>

      {/* Description */}
      <div className="mb-4 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-2/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-end space-x-2">
        <div className="h-9 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-9 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export default TaskCardSkeleton;
