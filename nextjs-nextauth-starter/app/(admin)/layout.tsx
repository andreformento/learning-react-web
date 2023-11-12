import "./adminGlobals.css";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import type {Metadata} from "next";
import {Sidebar} from "@/components/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If session not exists, display access denied message
  if (!session) {
    return (
      <html lang="en">
        <body className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col gap-2 items-center">
            <Image src="/stop.svg" alt="logo" width={56} height={56} />
            <h2 className="text-2xl font-semibold">Access Denied</h2>
            <p>You do not have permission to view this page.</p>
            <p>
              This route protected, Please{" "}
              <a href="/api/auth/signin?callbackUrl=/admin">login</a> first.
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Sidebar />
        <main>
          <header>
            <h2>Admin Dashboard</h2>
            <a href="/api/auth/signout">
              {session?.user && session?.user?.name}
              <Image
                src={session?.user?.image || "/user.svg"}
                alt="User Image"
                width={36}
                height={36}
                className="rounded-full"
              />
            </a>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
