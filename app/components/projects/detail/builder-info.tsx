"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface BuilderInfoProps {
  builder: {
    id: string;
    username: string;
    name: string;
    email: string;
    bio?: string;
    role: "builder" | "user";
  };
}

export function BuilderInfo({ builder }: BuilderInfoProps) {
  if (!builder || builder.role !== "builder") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold">{builder.name}</h3>
          <p className="text-sm text-gray-500">@{builder.username}</p>
        </div>

        {builder.bio && (
          <div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {builder.bio}
            </p>
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.location.href = `mailto:${builder.email}`}
        >
          <Mail className="mr-2 h-4 w-4" />
          Contact Builder
        </Button>
      </CardContent>
    </Card>
  );
} 