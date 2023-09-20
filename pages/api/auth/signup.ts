import prisma from "../../../utils/db";
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from "bcryptjs";
import signIn from "./signIn";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email, password, name } = req.body;

    // Check if the email already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Start a Prisma transaction to create a user and profile atomically
      const result = await prisma.$transaction([
        prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            profile: { // This will automatically create a profile for the user
              create: {
                name,  // Add name to profile
                // You can add other default profile values here if needed
              },
            },
          },
        }),
      ]);
      // The result will be an array with the user as its first element
      return res.status(201).json(result[0]);

    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Registration failed." });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
};
