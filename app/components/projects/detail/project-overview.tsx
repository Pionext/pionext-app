"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProjectCredits } from "@/hooks/use-project-credits";
import { calculateCurrentRaise, calculateTotalRaise } from "@/utils/bonding-curve";

interface ProjectOverviewProps {
  projectId: string;
  description: string;
}

export function ProjectOverview({ projectId, description }: ProjectOverviewProps) {
  const { credits } = useProjectCredits(projectId);

  if (!credits) {
    return null;
  }

  const amountRaised = calculateCurrentRaise(credits);
  const fundingGoal = calculateTotalRaise(credits);
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
      </CardContent>
    </Card>
  );
} 