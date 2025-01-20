"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProjectCredits } from "@/hooks/use-project-credits";
import { calculateCurrentRaise, calculateTotalRaise } from "@/utils/bonding-curve";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectOverviewProps {
  projectId: string;
  description: string;
  materials: {
    title: string;
    url: string;
    type: "PDF" | "Video" | "Website" | "Other";
  }[];
  launchDate: string;
  status: "Active" | "Completed" | "Upcoming";
}

export function ProjectOverview({ projectId, description, materials, launchDate, status }: ProjectOverviewProps) {
  const { credits } = useProjectCredits(projectId);

  if (!credits) {
    return null;
  }

  const amountRaised = calculateCurrentRaise(credits);
  const fundingGoal = calculateTotalRaise(credits);
  const progress = (amountRaised / fundingGoal) * 100;

  // Group materials by type for better organization
  const groupedMaterials = materials.reduce((acc, material) => {
    if (!acc[material.type]) {
      acc[material.type] = [];
    }
    acc[material.type].push(material);
    return acc;
  }, {} as Record<string, typeof materials>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Overview</CardTitle>
          <Badge variant={status === "Active" ? "default" : status === "Completed" ? "secondary" : "outline"}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Project Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Launch Date</p>
            <p className="font-medium">
              {new Date(launchDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Credit Supply</p>
            <p className="font-medium">
              {credits.currentSupply.toLocaleString()} / {credits.maxSupply.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Credit Symbol</p>
            <p className="font-medium">{credits.symbol}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-3">About the Project</h3>
          <div className="prose prose-sm max-w-none">
            {description.split('\n').map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line text-gray-600">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Funding Stats */}
        <div>
          <h3 className="font-semibold mb-4">Funding Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount Raised</span>
              <span className="font-medium">
                ${amountRaised.toLocaleString(undefined, { maximumFractionDigits: 2 })} / 
                ${fundingGoal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-500 mt-1">
              {progress.toFixed(1)}% of funding goal reached
            </p>
          </div>
        </div>

        {/* Supporting Materials */}
        {Object.keys(groupedMaterials).length > 0 && (
          <div>
            <h3 className="font-semibold mb-4">Supporting Materials</h3>
            <div className="grid gap-4">
              {Object.entries(groupedMaterials).map(([type, items]) => (
                <div key={type}>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">{type}s</h4>
                  <div className="space-y-2">
                    {items.map((material, index) => (
                      <a
                        key={index}
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium">{material.title}</span>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 