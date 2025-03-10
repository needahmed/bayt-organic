"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/app/actions/user.actions";

export default function AuthTestPage() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/debug-session");
        if (!response.ok) {
          throw new Error("Failed to fetch session data");
        }
        const data = await response.json();
        setSessionData(data);
        console.log("Session data:", data);
      } catch (err) {
        console.error("Error checking session:", err);
        setError("Error checking authentication status");
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  const onLogout = async () => {
    try {
      await handleLogout();
      // The redirect is handled by the server action
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to log out");
    }
  };

  if (loading) {
    return <div className="p-8">Loading authentication status...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="mb-4">
        <p className="font-semibold">Authenticated: {sessionData?.authenticated ? "Yes" : "No"}</p>
        {sessionData?.user && (
          <>
            <p className="font-semibold">User ID: {sessionData.user.id}</p>
            <p className="font-semibold">Name: {sessionData.user.name}</p>
            <p className="font-semibold">Email: {sessionData.user.email}</p>
            <p className="font-semibold">Role: {sessionData.user.role}</p>
          </>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Session Details</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
          {JSON.stringify(sessionData, null, 2)}
        </pre>
      </div>

      <div className="mt-8 space-y-4">
        {sessionData?.authenticated ? (
          <Button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white">
            Log Out
          </Button>
        ) : (
          <Link href="/auth/login">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Go to Login
            </Button>
          </Link>
        )}
        
        <div className="mt-4">
          <Link href="/profile" className="mr-4">
            <Button variant="outline">Go to Profile</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 