import { dbConnect } from "@/lib/mongoose";
import Payments from "@/models/PaymentSchema/PaymentSchema";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();
  const payment = await Payments.findById(params.id);
  return NextResponse.json(payment, { status: 200 });
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const payment = await Payments.findByIdAndDelete(params.id);
  if (!payment) {
    return NextResponse.json(
      { message: "Pago no encontrado" },
      { status: 404 },
    );
  }
  return NextResponse.json(
    { message: "Pago eliminado correctamente" },
    { status: 200 },
  );
}

export async function PUT(request, { params }) {
  await dbConnect();
  const body = await request.json();
  const payment = await Payments.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(payment, { status: 200 });
}
