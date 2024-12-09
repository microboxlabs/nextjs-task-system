const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Total Tasks Card */}
      <div className="h-32 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
          ></div>
        ))}
      </div>

      {/* Priority Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
