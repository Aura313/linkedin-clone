// api/connections/list.ts
import prisma from "@/utils/db";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { userId } = req.query;

    const connections = await prisma.connectionRequest.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' }
        ]
      },
      include: {

        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                profilePicUrl: true
              }
            }
          }
        },

        receiver: {
          select: {
            name: true,
            email: true,
            id: true,
            profile: {
              select: {
                profilePicUrl: true
              }
            }
          }
        }
      }
    });

    // Map to get only the user details excluding the logged-in user
    const connectedUsers = connections.map(conn =>
      conn.senderId === userId ? conn.receiver : conn.sender
    );

    return res.json(connectedUsers);
  }

  res.status(405).end();
};
