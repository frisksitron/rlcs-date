import prisma from "@/database";
import { Event } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export type EventsResponse = {
  events: Event[];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<EventsResponse>
) => {
  const events = await prisma.event.findMany({
    take: 10,
    orderBy: {
      startDate: "desc",
    },
  });

  res.status(200).json({ events });
};
