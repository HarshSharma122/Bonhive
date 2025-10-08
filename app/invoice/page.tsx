"use client";

import dynamic from "next/dynamic";
const Invoice = dynamic(()=>import("@/components/Invoice"),{
  ssr:false
})
import React, { Suspense } from "react";
const page = () => {
  return (
    <Suspense fallback={<div>Loading invoice....</div>}>
      <Invoice />
    </Suspense>
  );
};

export default page;
