import { dbConnect } from "@/lib/mongoose";
import Tags from "@/models/TagsSchema/TagsSchema";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const tags = await Tags.find({}).sort({ _id: 1 });
  return NextResponse.json(tags, { status: 200 });
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newTag = new Tags(body);
    const savedTag = await newTag.save();
    return NextResponse.json(savedTag, { status: 201 });
  } catch (error) {
    console.log("🚀 ~ error al crear la etiqueta:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
