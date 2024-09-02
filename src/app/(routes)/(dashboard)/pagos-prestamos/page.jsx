"use client";
import Payments from "./payments";

export default function page() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <Payments />
      </div>
    </div>
  );
}
