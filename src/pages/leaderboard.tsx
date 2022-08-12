import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import classNames from "classnames";
import TeamLogo from "@/components/TeamLogo";
import { twMerge } from "tailwind-merge";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/clients/rlcsdateClient";
import prisma from "@/database";
import * as R from "remeda";

const LeaderboardTable = () => {
  const { data: leaderboard } = useQuery(["leaderboard"], getLeaderboard);

  return (
    <div className="overflow-x-auto">
      <table className={"table table-zebra w-full"}>
        <thead>
          <tr>
            <th className={"!relative"}></th>
            <th>Team</th>
            <th>Region</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard?.map((team, index) => {
            const qualifiedClass = classNames({
              "bg-green-900": team.qualifiedForChampionship,
              "bg-yellow-900": team.qualifiedForWildcard,
            });
            const indexClass = twMerge(
              "flex justify-center items-center rounded-full aspect-square h-8 self-center",
              qualifiedClass
            );

            return (
              <tr key={team.name}>
                <td>
                  <div className="flex text-center font-bold justify-center leading-[1px]">
                    <div className={indexClass}>{index + 1}</div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="w-6 h-6 lg:w-12 lg:h-12">
                        <TeamLogo team={team.tag} />
                      </div>
                    </div>
                    <div className={"pl-1"}>
                      <div className="font-bold lg:hidden">{team.tag}</div>
                      <div className="font-bold hidden lg:block">
                        {team.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={"font-bold"}>{team.region}</div>
                </td>
                <td>
                  <div className={"font-bold"}>{team.points}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Leaderboard: NextPage = () => {
  return (
    <div>
      <Head>
        <title>rlcs.date - leaderboard</title>
        <meta
          name="description"
          content="Leaderboard for RLCS, Rocket League Championship Series 2021-2022"
        />
      </Head>

      <h1 className="text-2xl">Leaderboard RLCS 2021-2022</h1>
      <div className="p-4"></div>
      <div className="flex flex-col md:flex-row">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-green-900 mr-1.5 rounded-full"></div>
          <div> = Qualify directly to Worlds</div>
        </div>
        <div className="p-2 md:p-4"></div>
        <div className="flex items-center">
          <div className="h-8 w-8 bg-yellow-900 mr-1.5 rounded-full"></div>
          <div> = Qualify for Wildcards</div>
        </div>
      </div>
      <div className="p-2"></div>
      <LeaderboardTable />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();

  const leaderboard = await prisma.leaderboard.findMany();
  const sorted = R.sortBy(leaderboard, [(x) => x.points, "desc"]);

  queryClient.setQueryData(["leaderboard"], sorted);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default Leaderboard;
