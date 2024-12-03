"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface SupportingMaterialsProps {
  projectId: string;
}

export function SupportingMaterials({ projectId }: SupportingMaterialsProps) {
  // TODO: Fetch project data
  const materials = [
    {
      title: "Pitch Deck",
      url: "https://example.com/pitch-deck.pdf",
      type: "PDF",
    },
    {
      title: "Demo Video",
      url: "https://youtube.com/watch?v=demo",
      type: "Video",
    },
    {
      title: "Project Website",
      url: "https://project-website.com",
      type: "Website",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supporting Materials</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {materials.map((material, index) => (
            <a
              key={index}
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-medium">{material.title}</h3>
                <p className="text-sm text-gray-500">{material.type}</p>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 