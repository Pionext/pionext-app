"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface BuilderInfoProps {
  projectId: string;
}

export function BuilderInfo({ projectId }: BuilderInfoProps) {
  // TODO: Fetch builder data
  const builder = {
    name: "John Doe",
    username: "@johndoe",
    bio: "Experienced blockchain developer and entrepreneur with a passion for decentralized finance. Previously built successful DeFi protocols and Web3 applications.",
    contactEmail: "john@example.com",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold">{builder.name}</h3>
          <p className="text-sm text-gray-500">{builder.username}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {builder.bio}
          </p>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.location.href = `mailto:${builder.contactEmail}`}
        >
          <Mail className="mr-2 h-4 w-4" />
          Contact Builder
        </Button>
      </CardContent>
    </Card>
  );
} 