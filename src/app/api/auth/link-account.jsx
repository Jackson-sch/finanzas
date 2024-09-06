// pages/api/auth/link-account.js
import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User/User";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { userId } = req.body;

  try {
    await dbConnect();
    await User.findByIdAndUpdate(userId, { emailVerified: new Date() });
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error linking account" });
  }
}