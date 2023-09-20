// api/connection-request/send.ts
import prisma from "@/utils/db";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { senderId, receiverId } = req.body;

    // Check if a request already exists between these users
    const existingRequest = await prisma.connectionRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'A connection request already exists between these users.' });
    }

    const request = await prisma.connectionRequest.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING'
      }
    });

    return res.json(request);
  }

  res.status(405).end();
};
