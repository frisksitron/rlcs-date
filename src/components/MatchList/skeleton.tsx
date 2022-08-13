import { toShortName } from "@/helpers";
import { Match } from "@prisma/client";
import { format } from "date-fns";
import TeamLogo from "../TeamLogo";

const MatchListSkeleton = () => {
  return (
    <div className={"w-full font-bold"}>
      {[1, 2, 3, 4].map((match, index) => {
        const rowColor = index % 2 === 0 ? "bg-base-100" : "bg-base-200";

        return (
          <div
            key={index}
            className={`flex justify-between lg:px-10 p-4 first:rounded-t-lg last:rounded-b-lg ${rowColor}`}
          >
            <div className="w-5/12">
              <div className="flex items-center">
                <div className="avatar">
                  <div className="w-6 h-6 lg:w-12 lg:h-12 bg-slate-500 animate-pulse rounded-sm"></div>
                </div>
                <div className={"pl-2 md:pl-5"}>
                  <div className="lg:hidden overflow-hidden">
                    <div className="w-20 h-6 bg-slate-500 animate-pulse rounded-sm"></div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-20 h-6 bg-slate-500 animate-pulse rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/12">
              <div className={"flex justify-center items-center h-full "}>
                <div className="bg-slate-500"></div>
              </div>
            </div>
            <div className="w-5/12">
              <div className="flex justify-end items-center text-right">
                <div className={"pr-2 md:pr-5"}>
                  <div className="lg:hidden overflow-hidden">
                    <div className="w-20 h-6 bg-slate-500 animate-pulse rounded-sm"></div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-20 h-6 bg-slate-500 animate-pulse rounded-sm"></div>
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-6 h-6 lg:w-12 lg:h-12 bg-slate-500 animate-pulse rounded-sm"></div>
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
