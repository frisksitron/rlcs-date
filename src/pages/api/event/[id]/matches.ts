import type { NextApiRequest, NextApiResponse } from "next";
import { Match } from "@prisma/client";
import { getEventMatches } from "@/clients/octaneClient";
import { fromOctaneMatch } from "@/mappers";

export type MatchesResponse = {
  matches: Match[];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<MatchesResponse>
) => {
  const id = req.query.id!.toString();
  const [eventId, stageId] = id.split("-");
  const matches = await getEventMatches(eventId, stageId);

  res.status(200).json({ matches });
};
