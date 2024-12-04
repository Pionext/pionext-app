"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    tokenPrice: number;
    amountRaised: number;
    fundingGoal: number;
    launchDate: string;
    status: "Active" | "Completed" | "Upcoming";
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const progress = (project.amountRaised / project.fundingGoal) * 100;
  const formattedDate = new Date(project.launchDate).toLocaleDateString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Completed":
        return "bg-blue-500";
      case "Upcoming":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{project.name}</h3>
          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Token Price</span>
          <span className="font-medium">
            {Number.isFinite(project.tokenPrice) 
              ? `$${project.tokenPrice.toFixed(4)}`
              : "N/A"}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">
              {Number.isFinite(project.amountRaised) && Number.isFinite(project.fundingGoal)
                ? `$${project.amountRaised.toLocaleString(undefined, { maximumFractionDigits: 2 })} / $${project.fundingGoal.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "N/A"}
            </span>
          </div>
          <Progress value={Number.isFinite(progress) ? progress : 0} className="h-2" />
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