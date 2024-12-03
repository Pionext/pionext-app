"use client";

import { useState } from "react";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";

// TODO: Replace with actual project type from your backend
interface Project {
  id: string;
  name: string;
  description: string;
  tokenPrice: number;
  amountRaised: number;
  fundingGoal: number;
  launchDate: string;
}

export function ProjectGrid() {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    // Sample data - replace with actual API call
    {
      id: "1",
      name: "Sample Project 1",
      description: "This is a sample project description that spans multiple lines to demonstrate how the card handles longer text content.",
      tokenPrice: 0.5,
      amountRaised: 50000,
      fundingGoal: 100000,
      launchDate: "2023-12-01",
    },
    // Add more sample projects as needed
  ]);

  const loadMore = async () => {
    setIsLoading(true);
    // TODO: Implement actual pagination logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  if (projects.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      <div className="flex justify-center pt-4">
        <Button
          onClick={loadMore}
          disabled={isLoading}
          variant="outline"
          size="lg"
        >
          {isLoading ? "Loading..." : "Load More"}
        </Button>
      </div>
    </div>
  );
} 