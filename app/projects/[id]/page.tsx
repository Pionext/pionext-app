"use client";

import { ProjectHeader } from "@/app/components/projects/detail/project-header";
import { TradingSection } from "@/app/components/projects/detail/trading-section";
import { ProjectOverview } from "@/app/components/projects/detail/project-overview";
import { SupportingMaterials } from "@/app/components/projects/detail/supporting-materials";
import { BuilderInfo } from "@/app/components/projects/detail/builder-info";
import { useProject } from "@/hooks/use-project";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { project, isLoading, error } = useProject(params.id);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
          <p className="mt-2 text-gray-600">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <ProjectHeader 
          projectId={project.id}
          name={project.name}
          launchDate={project.launchDate}
          status={project.status as "Active" | "Completed" | "Upcoming"}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            <TradingSection projectId={project.id} />
            <ProjectOverview 
              projectId={project.id}
              description={project.description}
            />
            <SupportingMaterials materials={project.materials} />
          </div>
          
          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            {project.builder && <BuilderInfo builder={project.builder} />}
          </div>
        </div>
      </div>
    </main>
  );
} 