import type { NextApiRequest, NextApiResponse } from "next";
import { getPage } from "@/clients/liquipediaClient";
import { parseTransfersTable } from "@/parsers";
import prisma from "@/database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
        const page = await getPage(1378);
        const transfers = parseTransfersTable(page?.text["*"]);

        if (transfers.length > 0) {
          await prisma.transfer.deleteMany({});

          await prisma.transfer.createMany({
            data: transfers,
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
