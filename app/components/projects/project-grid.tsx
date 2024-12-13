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
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<(Project & { credit?: Credit })[]>([]);

  useEffect(() => {
    const loadProjects = () => {
      const projectsWithCredits = projectsData.projects.map(project => {
        const credit = creditsData.credits.find(c => c.projectId === project.id);
        return {
          ...project,
          credit,
          status: project.status as "Active" | "Completed" | "Upcoming"
        };
      });
      setProjects(projectsWithCredits);
    };

    loadProjects();
  }, []);

  const calculateProjectMetrics = (project: Project & { credit?: Credit }) => {
    if (!project.credit) {
      return {
        tokenPrice: 0,
        amountRaised: 0,
        fundingGoal: 0
      };
    }

    const currentPrice = calculatePrice(project.credit.currentSupply, {
      currentSupply: project.credit.currentSupply,
      maxSupply: project.credit.maxSupply
    });

    const amountRaised = calculateCurrentRaise({
      currentSupply: project.credit.currentSupply,
      maxSupply: project.credit.maxSupply
    });

    const fundingGoal = calculateTotalRaise({
      currentSupply: 0,
      maxSupply: project.credit.maxSupply
    });

    return {
      tokenPrice: currentPrice,
      amountRaised,
      fundingGoal
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
                tokenPrice: metrics.tokenPrice,
                amountRaised: metrics.amountRaised,
                fundingGoal: metrics.fundingGoal
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