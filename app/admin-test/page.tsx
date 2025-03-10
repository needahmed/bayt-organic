"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminTest() {
  const [roleData, setRoleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function checkRole() {
      try {
        const response = await fetch("/api/auth/check-role");
        if (!response.ok) {
          throw new Error("Failed to check role");
        }
        const data = await response.json();
        setRoleData(data);
        console.log("Role check data:", data);
      } catch (err) {
        console.error("Error checking role:", err);
        setError("Error checking authentication status");
      } finally {
        setLoading(false);
      }
    }

    checkRole();
  }, []);

  const handleAdminCheck = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/admin-check");
      const data = await response.json();
      console.log("Admin check response:", data);
      
      if (data.isAdmin) {
        router.push(data.redirect);
      } else {
        alert(`Access denied. Reason: ${data.authenticated ? 'Not an admin' : 'Not authenticated'}`);
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      setError("Error checking admin access");
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold mb-6">Authentication Status</h1>
      
      <div className="mb-4">
        <p className="font-semibold">Authenticated: {roleData?.isAuthenticated ? "Yes" : "No"}</p>
        <p className="font-semibold">Is Admin: {roleData?.isAdmin ? "Yes" : "No"}</p>
        <p className="font-semibold">Role: {roleData?.user?.role || "None"}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Session Details</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
          {JSON.stringify(roleData?.sessionDetails, null, 2)}
        </pre>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <button 
            onClick={handleAdminCheck}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
          >
            Check Admin Access
          </button>
          
          <Link href="/admin/dashboard" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Direct Link to Admin Dashboard
          </Link>
        </div>
        <div>
          <Link href="/" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 