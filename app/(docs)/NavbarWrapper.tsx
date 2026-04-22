"use client";

import { Navbar } from "@/app/components/Navbar";
import { Suspense } from "react";

export default function NavbarWrapper() {
  return (
    <Suspense fallback={<div className="h-16 border-b border-gray-100/50 bg-white/90" />}>
      <Navbar showSearch={false} />
    </Suspense>
  );
}
