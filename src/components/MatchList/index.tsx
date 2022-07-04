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
            className={`flex justify-between lg:px-10 p-4 first:rounded-t-lg last:rounded-b-lg ${rowColor}`}
          >
            <div className="w-5/12">
              <div className="flex items-center space-x-3">
                <div className="avatar">
                  <div className="w-6 h-6 lg:w-12 lg:h-12">
                    <TeamLogo team={toShortName(match.blueTeam!)} />
                  </div>
                </div>
                <div className={"pl-1"}>
                  <div className="lg:hidden">
                    {toShortName(match.blueTeam!)}
                  </div>
                  <div className="hidden lg:block">{match.blueTeam}</div>
                </div>
              </div>
            </div>
            <div className="w-2/12">
              <div className={"flex justify-center items-center h-full"}>
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
              <div className="flex justify-end items-center space-x-3">
                <div className={"pr-1"}>
                  <div className="lg:hidden">
                    {toShortName(match.orangeTeam!)}
                  </div>
                  <div className="hidden lg:block">{match.orangeTeam}</div>
                </div>
                <div className="avatar">
                  <div className="w-6 h-6 lg:w-12 lg:h-12">
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
