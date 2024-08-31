import { dbConnect } from "@/lib/mongoose";
import Transactions from "@/models/TransactionSchema/TransactionSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json()
    const newTransaction = new Transactions(body);
    const savedTransaction = await newTransaction.save();
    return NextResponse.json(savedTransaction, { status: 201 });
  } catch (error) {
    console.log("🚀 ~ error al crear la transacción:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  const transactions = await Transactions.find({}).sort({ date: -1 });
  return NextResponse.json(transactions, { status: 200 });
}