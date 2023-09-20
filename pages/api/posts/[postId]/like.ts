import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/db";

const handleToggleLike = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.body.userId; // Ideally, get this from a session or token
  const postId = req.query.postId;

  if (typeof postId !== 'string') {
    return res.status(400).json({ error: "Invalid postId ID." });
  }

  try {
    if (req.method === 'POST') {
      // Check if the user has already liked the post
      const existingLike = await prisma.reaction.findUnique({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });

      if (existingLike) {
        // If the like exists, delete it (unlike)
        await prisma.reaction.delete({
          where: {
            userId_postId: {
              userId: userId,
              postId: postId,
            },
          },
        });
      } else {
        // If the like does not exist, create a new one
        await prisma.reaction.create({
          data: {
            type: 'LIKE',
            userId: userId,
            postId: postId,
          },
        });
      }

      // Fetch and return the updated post
      const updatedPost = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile: true
            }
          },
          reactions: true,
          comments: true,
          media: true
        },
      });

      return res.status(200).json(updatedPost);

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling toggle like:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default handleToggleLike;
