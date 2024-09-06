import { dbConnect } from "@/lib/mongoose";
import Loan from "@/models/LoanSchema/LoanSchema";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();
  const loan = await Loan.findById(params.id);
  return NextResponse.json(loan, { status: 200 });
}

export async function PUT(request, { params }) {
  await dbConnect();
  const body = await request.json();
  const loan = await Loan.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(loan, { status: 200 });
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const loan = await Loan.findByIdAndDelete(params.id);
  return NextResponse.json(loan, { status: 200 });
}
