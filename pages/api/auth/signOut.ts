import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Clear the JWT cookie
    res.setHeader('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
    return res.status(200).json({ message: "Logged out successfully" });
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
};
