// api/connection-request/respond.ts
import prisma from "@/utils/db";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { requestId, action } = req.body;  // action can be 'ACCEPT' or 'REJECT'

    if (!['ACCEPT', 'REJECT'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action.' });
    }

    const request = await prisma.connectionRequest.update({
      where: { id: requestId },
      data: { status: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED' }
    });

    return res.json(request);
  }

  res.status(405).end();
};
