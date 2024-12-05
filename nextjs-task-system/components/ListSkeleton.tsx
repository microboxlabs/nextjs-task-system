import { useTheme } from "@/store";

interface ListSkeletonProps {
  loading: boolean;
  children: React.ReactNode;
  totalItems: number;
  columns?: number;
  rows?: number;
}

export default function ListSkeleton({
  loading,
  children,
  totalItems,
  columns = 4,
  rows = 4,
}: ListSkeletonProps) {
  const { t } = useTheme(state => state);

  return loading ? (
    <>
      <div className="hidden w-full animate-pulse xl:flex">
        <table className="my-[20px] w-full table-auto">
          <thead className="text-xs">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <td key={index}>
                  <div className="my-[20px] h-[10px] w-[40px] rounded bg-[--text-color]" />
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr
                key={index}
                className="rounded-md border-2 border-[--bg-color5] bg-[--bg-color3]"
              >
                {Array.from({ length: columns }).map((_, index) => (
                  <td key={index}>
                    <div className="my-[20px] h-[10px] w-[100px] rounded bg-[--text-color]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex animate-pulse flex-col gap-3 xl:hidden">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex h-fit w-full flex-col rounded-md border-DEFAULT border-[--text-color] bg-[--bg-color3] p-[20px]"
          >
            {Array.from({ length: columns }).map((_, index) => (
              <div
                key={index}
                className="flex w-full items-center justify-between border-b border-[--text-color] py-[10px]"
              >
                <div className="h-[10px] w-[40px] rounded bg-[--text-color]" />
                <div className="my-[5px] h-[10px] w-[100px] rounded bg-[--text-color]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  ) : (
    <>
      {totalItems > 0 ? (
        children
      ) : (
        <p className="mt-[20px] text-center">{t.noRecordFound}</p>
      )}
    </>
  );
}
