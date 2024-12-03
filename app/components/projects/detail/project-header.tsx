"use client";

import { Badge } from "@/components/ui/badge";

interface ProjectHeaderProps {
  projectId: string;
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  // TODO: Fetch project data
  const project = {
    name: "Sample Project",
    launchDate: "2023-12-01",
    status: "Active" as const,
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-4xl font-bold">{project.name}</h1>
        <p className="text-gray-500 mt-2">
          Launched {new Date(project.launchDate).toLocaleDateString()}
        </p>
      </div>
      <Badge 
        variant={project.status === "Active" ? "default" : "secondary"}
        className="w-fit"
      >
        {project.status}
      </Badge>
    </div>
  );
} 