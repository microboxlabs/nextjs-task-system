"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const Header = () => {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  return (
    <header>
      {session ? (
        <div>
          <p>{session.user?.name}</p>
          <p>{session.user?.email}</p>
          <p>{(session.user as any).role}</p>
          <button onClick={() => signOut()} className="btn-logout">
            signOut
          </button>
        </div>
      ) : (
        <div>
          <h1>You are not logged in</h1>
          <Link href="/auth/signin">sign in</Link>
        </div>
      )}
    </header>
  );
};
