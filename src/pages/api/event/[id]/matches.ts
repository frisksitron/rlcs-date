import type { NextApiRequest, NextApiResponse } from "next";
import { Match } from "@prisma/client";
import { getEventMatches } from "@/clients/octaneClient";

export type MatchesResponse = {
  matches: Match[];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<MatchesResponse>
) => {
  const id = req.query.id!.toString();
  const matches = await getEventMatches(id);

  res.status(200).json({ matches });
};
