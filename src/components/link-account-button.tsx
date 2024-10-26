"use client";
import React from "react";
import { Button } from "./ui/button";
import { getAurinkoAuthUrl } from "../lib/aurinko";

export const LinkAccountButton = () => {
  return (
    <Button
      onClick={async () => {
        const authUrl = await getAurinkoAuthUrl("Google");
        console.log(authUrl);
        window.location.href = authUrl;
      }}
    >
      Link Google
    </Button>
  );
};
