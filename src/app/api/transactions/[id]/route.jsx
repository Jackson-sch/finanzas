import { dbConnect } from "@/lib/mongoose";
import Transactions from "@/models/TransactionSchema/TransactionSchema";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();
  const transaction = await Transactions.findById(params.id);
  return NextResponse.json(transaction, { status: 200 });
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const transaction = await Transactions.findByIdAndDelete(params.id);
  if (!transaction) {
    return NextResponse.json({ message: "Transacción no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ message: "Transacción eliminada correctamente" }, { status: 200 });
}

export async function PUT(request, { params }) {
  await dbConnect();
  const body = await request.json();
  const transaction = await Transactions.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(transaction, { status: 200 });
}