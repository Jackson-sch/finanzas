import { dbConnect } from "@/lib/mongoose";
import Tag from "@/models/TagsSchema/TagsSchema";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();
  const tag = await Tag.findById(params.id);
  return NextResponse.json(tag, { status: 200 });
}

export async function PUT(request, { params }) {
  await dbConnect();
  const body = await request.json();
  const tag = await Tag.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(tag, { status: 200 });
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const tag = await Tag.findByIdAndDelete(params.id);
  return NextResponse.json(tag, { status: 200 });
}
