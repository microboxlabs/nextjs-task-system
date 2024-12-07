export default function Loading() {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between rounded bg-gray-100 p-3 shadow-md">
        <div className="flex gap-4">
          <div className="h-6 w-24 rounded bg-gray-300"></div>
          <div className="h-6 w-24 rounded bg-gray-300"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-6 w-32 rounded bg-gray-300"></div>
          <div className="h-6 w-32 rounded bg-gray-300"></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="h-16 w-full rounded bg-gray-200"></div>
          <div className="h-16 w-full rounded bg-gray-200"></div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-48 rounded bg-gray-300"></div>
            <div className="h-6 w-32 rounded bg-gray-300"></div>
            <div className="h-6 w-32 rounded bg-gray-300"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-6 w-48 rounded bg-gray-300"></div>
            <div className="h-6 w-32 rounded bg-gray-300"></div>
            <div className="h-6 w-32 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
