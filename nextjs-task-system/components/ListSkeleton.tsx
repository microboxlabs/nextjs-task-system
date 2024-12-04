import { useTheme } from "@/store";

export default function ListSkeleton ({ loading, children, totalItems, columns = 4, rows = 4}) {
  const { t } = useTheme();

  return loading ?
    <>
      <div className="hidden xl:flex w-full animate-pulse">
        <table className="table-auto w-full my-[20px]">
          <thead className="text-xs">
            <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <td  key={index}>
                <div className="h-[10px] w-[40px] bg-[--text-color] rounded my-[20px]" />
              </td> 
            ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr
                key={index}
                className="bg-[--bg-color3] rounded-md  border-2 border-[--bg-color5]"
              >
                {Array.from({ length: columns }).map((_, index) => (
                  <td  key={index}>
                    <div className="h-[10px] w-[100px] bg-[--text-color] rounded my-[20px]" />
                  </td> 
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex xl:hidden flex-col gap-3 animate-pulse ">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col w-full h-fit bg-[--bg-color3] rounded-md p-[20px] border-[1px] border-[--text-color]"
          >
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="flex justify-between items-center py-[10px] border-b-[1px] border-[--text-color] w-full">
                <div className="h-[10px] w-[40px] bg-[--text-color] rounded" />
                <div className="h-[10px] w-[100px] bg-[--text-color] rounded my-[5px]" />
              </div>
            ))}

          </div>
        ))}
      </div>
    </>
      :
    <>
        {totalItems > 0 ? 
              children : 
            <p className="text-center mt-[20px]">{t.noRecordFound}</p>
        }
    </>
}