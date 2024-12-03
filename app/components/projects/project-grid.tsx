"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";
import projectsData from "@/data/projects.json";
import creditsData from "@/data/credits.json";

interface Project {
  id: string;
  name: string;
  description: string;
  launchDate: string;
  status: "Active" | "Completed" | "Upcoming";
  creditId?: string;
}

interface Credit {
  id: string;
  projectId: string;
  currentSupply: number;
  maxSupply: number;
  initialPrice: number;
  slope: number;
}

export function ProjectGrid() {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<(Project & { credit?: Credit })[]>([]);

  useEffect(() => {
    // Simulate API call with our JSON data
    const loadProjects = () => {
      const projectsWithCredits = projectsData.projects.map(project => {
        const credit = creditsData.credits.find(c => c.projectId === project.id);
        return { ...project, credit };
      });
      setProjects(projectsWithCredits);
    };

    loadProjects();
  }, []);

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
          <ProjectCard 
            key={project.id} 
            project={{
              ...project,
              tokenPrice: project.credit ? 
                project.credit.initialPrice + (project.credit.slope * project.credit.currentSupply) : 
                0,
              amountRaised: project.credit ? 
                project.credit.currentSupply * (project.credit.initialPrice + (project.credit.slope * project.credit.currentSupply / 2)) : 
                0,
              fundingGoal: project.credit ? 
                project.credit.maxSupply * (project.credit.initialPrice + (project.credit.slope * project.credit.maxSupply / 2)) : 
                0
            }} 
          />
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