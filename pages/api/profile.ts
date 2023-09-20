import prisma from "../../utils/db";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return getProfile(req, res);
    case 'PUT':
      return updateProfile(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

// const getProfile = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { userId } = req.query;

//   let userWithProfile;

//   try {
//     userWithProfile = await prisma.user.findUnique({
//       where: { id: userId?.toString() },
//       include: { profile: true },
//     });
//   } catch (error) {
//     return res.status(500).json({ error: "Failed to retrieve profile." });
//   }

//   if (!userWithProfile) {
//     return res.status(404).json({ error: "User not found." });
//   }

//   const { password: _, ...userData } = userWithProfile;

//   const data = userData || { ...userData, profile: null };
//   return res.status(200).json(data);
// };

const getProfile = async (req: NextApiRequest, res: NextApiResponse) => {
    // Ensure userId is provided and is a string
    if (!req.query.userId || typeof req.query.userId !== 'string') {
        return res.status(400).json({ error: "Invalid user ID." });
    }

    const userId = req.query.userId;

    let userWithProfile;

    try {
        userWithProfile = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
    } catch (error) {
        console.error("Error fetching profile:", error);  // For logging
        return res.status(500).json({ error: "Failed to retrieve profile." });
    }

    // If user is not found in the database
    if (!userWithProfile) {
        return res.status(404).json({ error: "User not found." });
    }

    // Destructure and omit password
    const { password, ...userData } = userWithProfile;

    return res.status(200).json(userData);
};


// const updateProfile = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { userId } = req.query;

//   const updatedData = req.body;
//   let updatedUserProfile;
//   console.log(updatedData, "NextApiRequestNextApiRequest")
//   try {
//     updatedUserProfile = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         profile: {
//           update: {
//             // Don't include the id or userId here, just the fields you want to update
//             name: updatedData.name,
//             bio: updatedData.bio,
//             currentJob: updatedData.currentJob,
//             previousJobs: updatedData.profile.previousJobs,
//             education: updatedData.profile.education,
//             skills: updatedData.profile.skills,
//             profilePicUrl: updatedData.profilePicUrl
//             // ... any other fields you want to update
//           }
//         }
//       },
//     });

//     updatedUserProfile = await prisma.user.findUnique({
//       where: { id: userId?.toString() },
//       include: { profile: true },
//     });
//   // const { password: _, ...userData } = updatedUserProfile;
//     console.log(updatedUserProfile, "updatedUserProfile")
//     // Return the updated user profile
//     return res.status(200).json(updatedUserProfile);
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };


const updateProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure userId is provided and is a string
  if (!req.query.userId || typeof req.query.userId !== 'string') {
      return res.status(400).json({ error: "Invalid user ID." });
  }

  const userId = req.query.userId;
  const updatedData = req.body;
  console.log(updatedData, "updatedDataupdatedData")
  try {
    const updatedUserProfile = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          update: {
            // Make sure the fields are correctly located in updatedData
            name: updatedData.name,
            bio: updatedData.profile.bio,
            currentJob: updatedData.profile.currentJob,
            previousJobs: updatedData.profile.previousJobs,
            education: updatedData.profile.education,
            skills: updatedData.profile.skills,
            profilePicUrl: updatedData.profile.profilePicUrl
            // ... any other fields you want to update
          }
        }
      },
      include: { profile: true }, // Include profile to get the updated user with profile
    });

    // Destructure and omit password, if you're returning user data and it contains a password
    const { password, ...userData } = updatedUserProfile;
    return res.status(200).json(userData);

  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




