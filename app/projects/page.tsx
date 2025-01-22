"use client";

import React from "react";
import { ProjectGrid } from "@/app/components/projects/project-grid";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Browse Projects</h1>
        <Button 
          onClick={() => router.push("/projects/new")}
          variant="outline"
          className="border-[#0000FF] text-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-colors"
        >
          Create Project
        </Button>
      </div>
      <p className="text-gray-600 mb-8">
        Discover innovative projects and become an early supporter. Get the best prices by joining early - the sooner you participate, the better the deal!
      </p>
      <ProjectGrid />
    </main>
  );
} 