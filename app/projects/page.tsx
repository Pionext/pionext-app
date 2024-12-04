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
        <Button onClick={() => router.push("/projects/new")}>
          Create Project
        </Button>
      </div>
      <p className="text-gray-600 mb-8">
        Discover projects and trade their credits through automated bonding curves. 
        Early investors benefit from lower initial prices.
      </p>
      <ProjectGrid />
    </main>
  );
} 