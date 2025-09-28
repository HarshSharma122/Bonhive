"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
type childType = {
  children: React.ReactNode;
};
const Providers = ({ children }: childType) => {
  return (
    <div>
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
};

export default Providers;
