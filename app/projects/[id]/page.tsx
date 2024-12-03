"use client";

import { ProjectHeader } from "@/app/components/projects/detail/project-header";
import { TradingSection } from "@/app/components/projects/detail/trading-section";
import { ProjectOverview } from "@/app/components/projects/detail/project-overview";
import { SupportingMaterials } from "@/app/components/projects/detail/supporting-materials";
import { BuilderInfo } from "@/app/components/projects/detail/builder-info";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <ProjectHeader projectId={params.id} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            <TradingSection projectId={params.id} />
            <ProjectOverview projectId={params.id} />
            <SupportingMaterials projectId={params.id} />
          </div>
          
          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            <BuilderInfo projectId={params.id} />
          </div>
        </div>
      </div>
    </main>
  );
} 