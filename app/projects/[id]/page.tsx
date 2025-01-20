"use client";

import { ProjectHeader } from "@/app/components/projects/detail/project-header";
import { TradingSection } from "@/app/components/projects/detail/trading-section";
import { ProjectOverview } from "@/app/components/projects/detail/project-overview";
import { BuilderInfo } from "@/app/components/projects/detail/builder-info";
import { TradingWidget } from "@/app/components/projects/detail/trading-widget";
import { useProject } from "@/hooks/use-project";
import { Project } from "@/types/project";

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

  const typedProject = project as Project;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <ProjectHeader 
          projectId={typedProject.id}
          name={typedProject.name}
          launchDate={typedProject.launchDate}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectOverview project={typedProject} />
            <TradingSection projectId={typedProject.id} />
          </div>
          
          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            <TradingWidget 
              projectId={typedProject.id}
              projectName={typedProject.name}
            />
            {typedProject.builder && <BuilderInfo builder={typedProject.builder} />}
          </div>
        </div>
      </div>
    </main>
  );
} 