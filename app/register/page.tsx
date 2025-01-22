"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Closed Alpha
          </h2>
          <p className="mt-4 text-center text-gray-600">
            We're currently in closed alpha while we build and test our platform. Sign up for the waitlist to be notified when we open registration.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            className="w-full bg-[#0000FF] hover:bg-[#0000CC] text-white"
            onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSezTtspLSyb_9XQ0mjwmrZMtYe213s-8gMiJvQzk0Ou9Fqz9w/viewform', '_blank')}
          >
            Join Waitlist
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#0000FF] hover:text-[#0000CC]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 