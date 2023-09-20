// pages/api/feed.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'GET') {
//     try {
//       const posts = await prisma.post.findMany({
//         orderBy: {
//           createdAt: 'desc' // Fetch newest posts first
//         },
//         include: {
//           user: true // Also fetch the related user data for each post
//         }
//       });

//       return res.status(200).json({posts: posts});
//     } catch (error) {
//       return res.status(500).json({ error: 'Error fetching posts' });
//     }
//   } 

//   if (req.method === 'POST') {

//     try {
//       const { content, userId } = req.body;

//       // Validate content
//       if (!content || typeof content !== 'string') {
//         return res.status(400).json({ error: 'Content is required' });
//       }

//       // TODO: You would ideally want to get the userId from the logged-in user's session or token.

//       const post = await prisma.post.create({
//         data: {
//           content,
//           userId,
//         },
//       });

//       console.log(post, "postpost")

//       return res.status(200).json(post);

//     } catch (error: any) {
//       return res.status(500).json({ error: error.message || 'Error creating post' });
//     }
//   }
//   // ... other methods
// }


// // pages/api/posts.ts

// import prisma from '../../utils/db';
// import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return getPosts(req, res);
    case 'POST':
      return createPost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const getPosts = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          include: {
            profile: true
          }
        },             // Fetch the associated user
        reactions: true,        // Fetch all reactions
        comments: {             // Fetch all comments
          include: {
            user: {
              select: {
                id: true,
                name: true,
                // ... any other fields from the User model you'd like to fetch for the comment's user
                profile: true   // Fetch the associated user's profile for each comment
              }
            }          // For each comment, fetch the associated user
          },
          orderBy: {
            createdAt: 'desc'       // Order by the latest posts
          }
        },
        media: true             // Fetch all media associated with the post
      },
      orderBy: {
        createdAt: 'desc'       // Order by the latest posts
      }
    });
    res.status(200).json({ posts: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createPost = async (req: NextApiRequest, res: NextApiResponse) => {
  // ... (You already have this logic, just place it here)
  // try {
  //   const { content, userId } = req.body;

  //   // Validate content
  //   if (!content || typeof content !== 'string') {
  //     return res.status(400).json({ error: 'Content is required' });
  //   }

  //   // TODO: You would ideally want to get the userId from the logged-in user's session or token.

  //   const post = await prisma.post.create({
  //     data: {
  //       content,
  //       userId,
  //     },
  //   });

  //   console.log(post, "postpost")

  //   return res.status(200).json(post);

  // } catch (error: any) {
  //   return res.status(500).json({ error: error.message || 'Error creating post' });
  // }


  const { content, userId } = req.body;

  // Basic validation for content and userId
  if (!content || !userId) {
    return res.status(400).json({ error: "Content and userId are required." });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true
          }
        },          // Include the user details
        reactions: true,     // Include reactions
        comments: true,      // Include comments

        // Add other related models here if needed
      }
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post." });
  }

};
