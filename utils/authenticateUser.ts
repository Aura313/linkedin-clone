// utils/authenticateUser.ts
import prisma from "./db";
import bcrypt from "bcryptjs";

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid login credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid login credentials");
  }

  const { password: _, ...userData } = user;
console.log(userData, "dqiwodjoiwqdj");
  return userData;
}
