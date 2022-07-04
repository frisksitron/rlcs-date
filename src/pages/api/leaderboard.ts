import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/database";
import { Leaderboard } from "@prisma/client";
import * as R from "remeda";

export type LeaderboardResponse = {
  leaderboard: Leaderboard[];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardResponse>
) => {
  const leaderboard = await prisma.leaderboard.findMany();
  const sorted = R.sortBy(leaderboard, [(x) => x.points, "desc"]);

  res.status(200).json({ leaderboard: sorted });
};
