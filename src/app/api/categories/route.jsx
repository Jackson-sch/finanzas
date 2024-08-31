import { dbConnect } from "@/lib/mongoose";
import Category from "@/models/CategorySchema/CategorySchema";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newCategory = new Category(body);
    const savedCategory = await newCategory.save();
    return NextResponse.json(savedCategory, { status: 201 });
  } catch (error) {
    console.log("🚀 ~ error al crear la categoría:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  const categories = await Category.find({}).sort({ name: 1 });
  return NextResponse.json(categories, { status: 200 });
}
