import prisma from "@/database";
import { Event } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as R from "remeda";

export type EventsResponse = {
  events: Event[];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<EventsResponse>
) => {
  const events = await prisma.event.findMany();
  const sorted = R.sortBy(events, [
    (x) => new Date(x.startDate).getTime(),
    "desc",
  ]);

  res.status(200).json({ events: sorted });
};
