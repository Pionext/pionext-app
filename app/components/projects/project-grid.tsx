"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";
import projectsData from "@/data/projects.json";
import creditsData from "@/data/credits.json";
import { calculatePrice, calculateCurrentRaise, calculateTotalRaise } from "@/utils/bonding-curve";

interface Project {
  id: string;
  name: string;
  description: string;
  launchDate: string;
  status: "Active" | "Completed" | "Upcoming";
  image?: {
    url: string;
    alt?: string;
  };
}

interface Credit {
  id: string;
  projectId: string;
  symbol: string;
  name: string;
  currentSupply: number;
  maxSupply: number;
  targetPrice: number;
}

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      // Ensure projects have the correct status type
      const typedProjects = projectsData.projects.map(project => ({
        ...project,
        status: project.status as "Active" | "Completed" | "Upcoming"
      }));
      setProjects(typedProjects);
      setIsLoading(false);
    }, 1000);
  }, []);

  const calculateProjectMetrics = (project: Project) => {
    const credit = creditsData.credits.find(c => c.projectId === project.id);
    if (!credit) {
      return {
        tokenPrice: 0,
        amountRaised: 0,
        fundingGoal: 0,
        currentSupply: 0,
        maxSupply: 0
      };
    }

    const currentPrice = calculatePrice(credit.currentSupply, credit);
    const amountRaised = calculateCurrentRaise(credit);
    const fundingGoal = calculateTotalRaise(credit);

    return {
      tokenPrice: currentPrice,
      amountRaised,
      fundingGoal,
      currentSupply: credit.currentSupply,
      maxSupply: credit.maxSupply
    };
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
        {projects.map((project) => {
          const metrics = calculateProjectMetrics(project);
          return (
            <ProjectCard 
              key={project.id} 
              project={{
                ...project,
                amountRaised: metrics.amountRaised,
                fundingGoal: metrics.fundingGoal,
                currentSupply: metrics.currentSupply,
                maxSupply: metrics.maxSupply
              }} 
            />
          );
        })}
      </div>
      
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      <div className="flex justify-center pt-4">
        <Button
          onClick={() => {
            setIsLoading(true);
            // TODO: Implement actual pagination logic
            setTimeout(() => setIsLoading(false), 1000);
          }}
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