import { dbConnect } from "@/lib/mongoose";
import Loan from "@/models/LoanSchema/LoanSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newLoan = new Loan(body);
    const savedLoan = await newLoan.save();
    return NextResponse.json(savedLoan, { status: 201 });
  } catch (error) {
    console.log("🚀 ~ error al crear el préstamo:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  const loans = await Loan.find({});
  return NextResponse.json(loans, { status: 200 });
}