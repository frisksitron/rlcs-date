import { twMerge } from "tailwind-merge";

const MatchListSkeleton = () => {
  return (
    <div className={"w-full font-bold"}>
      {[1, 2, 3, 4].map((match, index) => {
        const rowColor = index % 2 === 0 ? "bg-base-100" : "bg-base-200";

        const widths = [
          ["w-20", "w-6"],
          ["w-24", "w-8"],
          ["w-28", "w-10"],
          ["w-32", "w-12"],
          ["w-36", "w-16"],
        ];
        const randomWidth = () =>
          widths[Math.floor(Math.random() * widths.length)];
        const randomWidths = [randomWidth(), randomWidth()];

        return (
          <div
            key={index}
            className={`flex justify-between p-4 first:rounded-t-lg last:rounded-b-lg lg:px-10 ${rowColor}`}
          >
            <div
              className={
                "hidden w-6 w-8 w-10 w-12 w-16 w-20 w-24 w-28 w-32 w-36"
              }
            ></div>
            <div className="w-5/12">
              <div className="flex items-center">
                <div className="avatar">
                  <div className="h-6 w-6 animate-pulse rounded-sm bg-slate-500 lg:h-12 lg:w-12"></div>
                </div>
                <div className={"pl-2 md:pl-5"}>
                  <div className="overflow-hidden lg:hidden">
                    <div
                      className={`${randomWidths[0][1]} h-6 animate-pulse rounded-sm bg-slate-500`}
                    ></div>
                  </div>
                  <div className="hidden lg:block">
                    <div
                      className={`${randomWidths[0][0]} h-6 animate-pulse rounded-sm bg-slate-500`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/12">
              <div className={"flex h-full items-center justify-center "}>
                <div className="h-6 w-12 animate-pulse rounded-sm bg-slate-500"></div>
              </div>
            </div>
            <div className="w-5/12">
              <div className="flex items-center justify-end text-right">
                <div className={"pr-2 md:pr-5"}>
                  <div className="overflow-hidden lg:hidden">
                    <div
                      className={`${randomWidths[1][1]} h-6 animate-pulse rounded-sm bg-slate-500`}
                    ></div>
                  </div>
                  <div className="hidden lg:block">
                    <div
                      className={`${randomWidths[1][0]} h-6 animate-pulse rounded-sm bg-slate-500`}
                    ></div>
                  </div>
                </div>
                <div className="avatar">
                  <div className="h-6 w-6 animate-pulse rounded-sm bg-slate-500 lg:h-12 lg:w-12"></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchListSkeleton;
