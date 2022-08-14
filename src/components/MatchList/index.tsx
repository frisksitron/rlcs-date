import { toShortName } from "@/helpers";
import { Match } from "@prisma/client";
import { format } from "date-fns";
import TeamLogo from "../TeamLogo";

const MatchList = ({ matches }: { matches: Match[] }) => {
  if (!matches) {
    return null;
  }

  return (
    <div className={"w-full font-bold"}>
      {matches.map((match, index) => {
        const rowColor = index % 2 === 0 ? "bg-base-100" : "bg-base-200";

        return (
          <div
            key={match.id}
            className={`flex justify-between p-4 first:rounded-t-lg last:rounded-b-lg lg:px-10 ${rowColor}`}
          >
            <div className="w-5/12">
              <div className="flex items-center">
                <div className="avatar">
                  <div className="h-6 w-6 lg:h-12 lg:w-12">
                    <TeamLogo team={toShortName(match.blueTeam!)} />
                  </div>
                </div>
                <div className={"min-w-0 flex-1 shrink-0 pl-2 md:pl-5"}>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap lg:hidden">
                    {toShortName(match.blueTeam!)}
                  </div>
                  <div className="hidden lg:block">{match.blueTeam}</div>
                </div>
              </div>
            </div>
            <div className="w-2/12">
              <div className={"flex h-full items-center justify-center "}>
                {match.blueScore === null && match.orangeScore === null ? (
                  format(new Date(match.startTime!), "HH:mm")
                ) : (
                  <>
                    {match.blueScore ?? 0} - {match.orangeScore ?? 0}
                  </>
                )}
              </div>
            </div>
            <div className="w-5/12">
              <div className="flex items-center justify-end text-right">
                <div className={"min-w-0 flex-1 shrink-0 pr-2 md:pr-5"}>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap lg:hidden">
                    {toShortName(match.orangeTeam!)}
                  </div>
                  <div className="hidden lg:block">{match.orangeTeam}</div>
                </div>
                <div className="avatar">
                  <div className="h-6 w-6 lg:h-12 lg:w-12">
                    <TeamLogo team={toShortName(match.orangeTeam!)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchList;
