"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PionextCredits } from "../components/profile/pionext-credits";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Redirect if not authenticated
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Profile</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg">{user.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg">{user.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-lg">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <PionextCredits />

          <div className="flex justify-end">
            <Button 
              variant="destructive"
              onClick={() => {
                logout();
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
} 