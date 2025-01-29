// /src/components/ClientSessionProvider.tsx

'use client';

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ClientSessionProvider = ({ children }: Props) => {
  return (
    <SessionProvider>{children}</SessionProvider> // Wrap children with SessionProvider
  );
};

export default ClientSessionProvider;
