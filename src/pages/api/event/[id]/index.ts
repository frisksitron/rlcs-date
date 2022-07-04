import type { NextApiRequest, NextApiResponse } from "next";
import { Event, Match } from "@prisma/client";
import prisma from "@/database";

export type EventResponse = Event & {
  matches: Match[];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<EventResponse>
) => {
  const id = req.query.id!.toString();
  const event = await prisma.event.findFirst({
    where: { id },
    include: { matches: true },
  });

  if (!event) {
    res.status(404);
  } else {
    res.status(200).json(event);
  }
};
