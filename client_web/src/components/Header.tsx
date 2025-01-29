"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold">
            <span className="text-[#FF8000]">A</span>bista
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/industry" className="text-gray-600 hover:text-gray-900">
            Industry Specific
          </Link>
          <Link href="/doors" className="text-gray-600 hover:text-gray-900">
            Doors
          </Link>
          <Link href="/frames" className="text-gray-600 hover:text-gray-900">
            Frames
          </Link>
          <Link href="/hardware" className="text-gray-600 hover:text-gray-900">
            Hardware
          </Link>
          <Link href="/projects" className="text-gray-600 hover:text-gray-900">
            Projects
          </Link>
          <Link href="/bulk-orders" className="text-gray-600 hover:text-gray-900">
            Bulk Orders
          </Link>
        </div>

        {/* User Authentication / Session */}
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              {/* If user is logged in, show Dashboard and Sign Out */}
              <Button variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <>
              {/* If user is not logged in, show Login and Sign Up */}
              <Button variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="ghost">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
