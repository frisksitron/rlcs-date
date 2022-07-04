import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/database";
import { Transfer } from "@prisma/client";

export type TransfersResponse = {
  transfers: Transfer[];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TransfersResponse>
) => {
  const transfers = await prisma.transfer.findMany();

  res.status(200).json({ transfers });
};
