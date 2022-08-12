import type { NextApiRequest, NextApiResponse } from "next";
import { getTodaysMatches } from "@/clients/octaneClient";
import { MatchesResponse } from "./matches";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<MatchesResponse>
) => {
  const id = req.query.id!.toString();
  const matches = await getTodaysMatches(id);

  res.status(200).json({ matches });
};
