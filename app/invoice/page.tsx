"use client";

import Invoice from "@/components/Invoice";
import React, { Suspense } from "react";
const page = () => {
  return (
    <Suspense fallback={<div>Loading invoice....</div>}>
      <Invoice />
    </Suspense>
  );
};

export default page;
