import { dbConnect } from "@/lib/mongoose";
import Payments from "@/models/PaymentSchema/PaymentSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json()
    const newPayment = new Payments(body);
    const savedPayment = await newPayment.save();
    return NextResponse.json(savedPayment, { status: 201 });
  } catch (error) {
    console.log("🚀 ~ error al crear el pago:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  const payments = await Payments.find({}).sort({ paymentNumber: -1 });
  return NextResponse.json(payments, { status: 200 });
}
