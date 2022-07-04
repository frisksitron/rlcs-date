import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/database";
import { fromOctaneMatch } from "@/mappers";
import { getEventMatches } from "@/clients/octaneClient";
import { Match } from "@prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
        const events = await prisma.event.findMany();

        const matches: Match[] = [];

        for (const event of events) {
          const [eventId, stageId] = event.id.split("-");
          const eventMatches = await getEventMatches(eventId, stageId);
          matches.push(...eventMatches.map(fromOctaneMatch));
        }

        await prisma.$transaction(
          matches.map((event) =>
            prisma.match.upsert({
              where: { id: event.id },
              update: event,
              create: event,
            })
          )
        );

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
