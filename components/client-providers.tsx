"use client";

import { AuthProvider } from '@/lib/auth-context';

interface ClientProvidersProps {
  children: React.ReactNode;
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ClientProviders; 