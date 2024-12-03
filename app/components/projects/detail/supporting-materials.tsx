"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface SupportingMaterialsProps {
  materials: {
    title: string;
    url: string;
    type: "PDF" | "Video" | "Website" | "Other";
  }[];
}

export function SupportingMaterials({ materials }: SupportingMaterialsProps) {
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