// api/connections/status.ts
import prisma from "@/utils/db";

import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { loggedInUserId, targetUserId } = req.query;

    const connection = await prisma.connectionRequest.findFirst({
      where: {
        OR: [
          { senderId: loggedInUserId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: loggedInUserId }
        ]
      }
    });

    if (!connection) {
      return res.json({ status: 'NOT_CONNECTED' });
    }

    return res.json({ status: connection.status });
  }

  res.status(405).end();
};
