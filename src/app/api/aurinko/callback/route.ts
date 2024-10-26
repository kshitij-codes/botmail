// /api/aurinko/callback

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const params = await request.nextUrl.searchParams;
  const status = params.get("status");
  if (status !== "success") {
    return NextResponse.json(
      { error: "Failed to link account" },
      { status: 400 },
    );
  }
  const code = params.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }
  const token = await exchangeCodeForAccessToken(code);
  if (!token) {
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 400 },
    );
  }
  const accountDetails = await getAccountDetails(token.accessToken);
  if (!accountDetails) {
    return NextResponse.json(
      { error: "Failed to get account details" },
      { status: 400 },
    );
  }
  const account = await db.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
      accessToken: token.accessToken,
    },
  });

  return NextResponse.redirect(new URL("/mail", request.url));
}
