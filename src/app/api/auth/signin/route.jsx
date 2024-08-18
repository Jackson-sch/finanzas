import { getSession } from "@/lib/getSession";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getSession({ request });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: "Sign in successful" }, { status: 200 });
}
