"use client";

import React from "react";
import { ProjectGrid } from "@/app/components/projects/project-grid";

export default function ProjectsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Projects</h1>
      <ProjectGrid />
    </main>
  );
} 