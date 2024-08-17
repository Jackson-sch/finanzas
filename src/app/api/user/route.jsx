
import {dbConnect} from "@/lib/mongoose";
import User from "@/models/User/User";
import {hash} from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const hashedPassword = await hash(body.password, 12);
    // TODO: Add validation
    if (!body.lastName || !body.firstName || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newUser = new User({...body, password: hashedPassword});
    const savedUser = await newUser.save();
    return NextResponse.json(savedUser, { status: 201 });
  } catch (error) {
    console.log("🚀 ~ error al crear el usuario:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  const users = await User.find({});
  return NextResponse.json(users, { status: 200 });
}
