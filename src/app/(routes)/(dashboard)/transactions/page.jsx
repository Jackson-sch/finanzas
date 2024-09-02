"use client";
import TransactionV2 from "@/components/(dashboard)/Transaction/TransactionV2";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        <TransactionV2 />
      </div>
    </div>
  );
}
