"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectOverviewProps {
  projectId: string;
}

export function ProjectOverview({ projectId }: ProjectOverviewProps) {
  // TODO: Fetch project data
  const project = {
    description: `This is a sample project description. It can contain multiple paragraphs and formatting.

    The project aims to revolutionize the way we think about decentralized finance and community-driven development.
    
    Key features:
    • Feature 1
    • Feature 2
    • Feature 3`,
    amountRaised: 50000,
    fundingGoal: 100000,
    totalTokens: 1000000,
    yourBalance: 0,
  };

  const progress = (project.amountRaised / project.fundingGoal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div className="prose prose-sm max-w-none">
          {project.description.split('\n').map((paragraph, index) => (
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
                ${project.amountRaised.toLocaleString()} / ${project.fundingGoal.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Token Stats */}
        <div>
          <h3 className="font-semibold mb-4">Token Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Tokens Issued</span>
              <span className="font-medium">{project.totalTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Your Balance</span>
              <span className="font-medium">{project.yourBalance.toLocaleString()} tokens</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 