import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      // Fetch user profile information from the database
      const userProfileData = await prisma.user.findMany({
        select: {
          profile: true // Only select the profile information
        }
      });

      // Return the user profile data in the response
      return res.status(200).json(userProfileData);
    } catch (error) {
      console.error('Error fetching user profile data:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile data.' });
    }
  } else {
    // Handle other request methods or return an error for unsupported ones
    return res.status(405).end(); // Method Not Allowed
  }
};
