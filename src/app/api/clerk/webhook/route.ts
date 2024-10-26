// /api/clerk/webhook

import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../server/db";

export async function POST(request: NextRequest) {
  const { data } = await request.json();
  const emailAddress = data.email_addresses[0].email_address;
  const firstName = data.first_name;
  const lastName = data.last_name;
  const id = data.id;

  await db.user.create({
    data: {
      emailAddress,
      firstName,
      lastName,
      id,
    },
  });

  return new Response("Webhook received", { status: 200 });
}
