import { SessionProvider } from "next-auth/react";

export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div>{children}</div>;

    </SessionProvider >)
}
