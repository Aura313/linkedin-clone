// // api/connections/requests.ts
// import { getSession } from 'next-auth/react';  // Assuming you're using next-auth
// import prisma from "@/utils/db";
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//     if (req.method === 'GET') {
//         const session: any = await getSession({ req });

//         // console.log(session, "sessionsession")
//         if (!session || !session.user || !session.user.id) {
//             return res.status(401).json({ error: 'Not authenticated' });
//         }

//         const userId = session.user.id; // Retrieve this from the logged-in user's session

//         try {
//             const receivedRequests = await prisma.connectionRequest.findMany({
//                 where: { receiverId: userId, status: 'PENDING' }, // Only fetch pending requests
//                 include: { sender: true }
//             });

//             const sentRequests = await prisma.connectionRequest.findMany({
//                 where: { senderId: userId },
//                 include: { receiver: true }
//             });

//             return res.json({
//                 receivedRequests,
//                 sentRequests
//             });
//         } catch (error) {
//             console.error("Error fetching connection requests:", error);
//             res.status(500).json({ error: "Failed to fetch connection requests." });
//         }
//     }

//     // Handle other request methods or send an error for unsupported ones
//     return res.status(405).end();
// };
// api/connections/requests.ts
import { getSession } from 'next-auth/react';  // Assuming you're using next-auth
import prisma from "@/utils/db";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const session: any = await getSession({ req });

        if (!session || !session.user || !session.user.id) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const userId = session.user.id; // Retrieve this from the logged-in user's session

        try {
            const receivedRequests = await prisma.connectionRequest.findMany({
                where: { receiverId: userId, status: 'PENDING' }, // Only fetch pending requests
                include: {
                    sender: {
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

            const sentRequests = await prisma.connectionRequest.findMany({
                where: { senderId: userId },
                include: {
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

            return res.json({
                receivedRequests,
                sentRequests
            });
        } catch (error) {
            console.error("Error fetching connection requests:", error);
            res.status(500).json({ error: "Failed to fetch connection requests." });
        }
    }

    // Handle other request methods or send an error for unsupported ones
    return res.status(405).end();
};
