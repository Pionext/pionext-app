"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    tokenPrice: number;
    amountRaised: number;
    fundingGoal: number;
    launchDate: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const progress = (project.amountRaised / project.fundingGoal) * 100;
  const formattedDate = new Date(project.launchDate).toLocaleDateString();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <h3 className="text-xl font-semibold">{project.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Token Price</span>
          <span className="font-medium">${project.tokenPrice}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">
              ${project.amountRaised.toLocaleString()} / ${project.fundingGoal.toLocaleString()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Launch Date</span>
          <span className="font-medium">{formattedDate}</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => router.push(`/projects/${project.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
} 