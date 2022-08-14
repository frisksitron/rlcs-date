import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/database";
import { getEvents } from "@/clients/octaneClient";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
        const events = await getEvents("2022-01-01", "rlcs2122");

        await prisma.$transaction(
          events.map((event) =>
            prisma.event.upsert({
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
