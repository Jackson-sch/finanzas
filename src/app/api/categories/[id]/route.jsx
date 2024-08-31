import { dbConnect } from "@/lib/mongoose";
import Category from "@/models/CategorySchema/CategorySchema";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();
  const category = await Category.findById(params.id);
  return NextResponse.json(category, { status: 200 });
}

export async function PUT(request, { params }) {
  await dbConnect();
  const body = await request.json();
  const category = await Category.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(category, { status: 200 });
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const category = await Category.findByIdAndDelete(params.id);
  return NextResponse.json(category, { status: 200 });
}
