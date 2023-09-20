import { authenticateUser } from "../../../utils/authenticateUser";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const userData = await authenticateUser(req.body.email, req.body.password);
      const token = jwt.sign({ userId: userData.id }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
      });

      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${60 * 60}`);

      // res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}`);
      return res.status(200).json({ token, user: userData });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
};
