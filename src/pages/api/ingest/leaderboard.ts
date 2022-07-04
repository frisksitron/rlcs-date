import type { NextApiRequest, NextApiResponse } from "next";
import { getPage } from "@/clients/liquipediaClient";
import { parseLeaderboardTables } from "@/parsers";
import prisma from "@/database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
        const page = await getPage(112991);
        const teams = parseLeaderboardTables(page?.text["*"]);

        if (teams.length > 0) {
          await prisma.leaderboard.deleteMany({});

          await prisma.leaderboard.createMany({
            data: teams,
          });
        }

        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
