"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProjectCredits } from "@/hooks/use-project-credits";

interface ProjectOverviewProps {
  projectId: string;
  description: string;
}

export function ProjectOverview({ projectId, description }: ProjectOverviewProps) {
  const { credits } = useProjectCredits(projectId);

  if (!credits) {
    return null;
  }

  const currentPrice = credits.initialPrice + (credits.slope * credits.currentSupply);
  const amountRaised = credits.currentSupply * (credits.initialPrice + (credits.slope * credits.currentSupply / 2));
  const fundingGoal = credits.maxSupply * (credits.initialPrice + (credits.slope * credits.maxSupply / 2));
  const progress = (amountRaised / fundingGoal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div className="prose prose-sm max-w-none">
          {description.split('\n').map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
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
          </div>
        </div>

        {/* Token Stats */}
        <div>
          <h3 className="font-semibold mb-4">Credit Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Current Price</span>
              <span className="font-medium">${currentPrice.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Credits</span>
              <span className="font-medium">{credits.maxSupply.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Credits Issued</span>
              <span className="font-medium">{credits.currentSupply.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 