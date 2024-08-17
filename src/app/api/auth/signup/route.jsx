
import {dbConnect} from "@/lib/mongoose";
import User from "@/models/User/User";
import {hash} from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
      await dbConnect();
      const body = await request.json();
      const { firstName, lastName, email, password } = body;
  
      // Validación de campos obligatorios
      if (!firstName || !lastName || !email || !password) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }
  
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 409 }, // 409 Conflict
        );
      }
  
      // Hashear la contraseña
      const hashedPassword = await hash(password, 12);
  
      // Crear y guardar el nuevo usuario
      const newUser = new User({ ...body, password: hashedPassword });
      const savedUser = await newUser.save();
  
      return NextResponse.json(savedUser, { status: 201 });
    } catch (error) {
      console.log("🚀 ~ Error al crear el usuario:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  

export async function GET() {
  await dbConnect();
  const users = await User.find({});
  return NextResponse.json(users, { status: 200 });
}
