import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const requestId = req.query.requestId;

        try {
            await prisma.connectionRequest.update({
                where: { id: requestId },
                data: { status: 'rejected' }
            });

            res.status(200).json({ message: 'Connection request rejected' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while rejecting the connection request.' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
};
