// // api/posts/[postId]/comments.ts
// import prisma from "@/utils/db";
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     const postId = req.query.postId;

//     // Get the comment data from request body
//     const { content, userId } = req.body;

//     if (!content || !userId) {
//       return res.status(400).json({ error: 'Comment content or user ID missing.' });
//     }

//     // Fetch the post
//     const post = await prisma.post.findUnique({ where: { id: postId } });

//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     // Add the comment
//     const newComment = await prisma.comment.create({
//       data: {
//         content,
//         postId: postId,
//         // Assuming you're storing which user made the comment
//         userId: userId // adjust accordingly based on your setup
//       }, 
//     //   include: {
//     //     user: true,
//     //   }
//     });

//      // Fetch and return the updated post
//      const updatedPost = await prisma.post.findUnique({
//       where: { id: postId },
//       include: {
//         user: true,
//         reactions: true,
//         comments: true,
//         media: true
//       },
//     });

//     return res.json(updatedPost);
//   }

//   // Handle other request methods or send an error for unsupported ones
//   return res.status(405).end();
// }

import prisma from "@/utils/db";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {


    const postIdRaw = req.query.postId;
    if (Array.isArray(postIdRaw) || typeof postIdRaw === 'undefined') {
      return res.status(400).json({ error: 'Invalid postId.' });
    }
    const postId = postIdRaw;

    const { content, userId } = req.body;

    // Validate input
    if (!content || !userId) {
      return res.status(400).json({ error: 'Comment content or user ID missing.' });
    }

    // Check if the user and post exist
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Create the comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: postId,
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          }
        },
        post: true
      }
    });

    return res.status(201).json(newComment);
  }

  // Handle other request methods
  return res.status(405).end();
};
