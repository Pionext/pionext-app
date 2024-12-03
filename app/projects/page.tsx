"use client";

import React from "react";
import { ProjectGrid } from "@/app/components/projects/project-grid";

export default function ProjectsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Projects</h1>
      <p className="text-gray-600 mb-8">
        Discover projects and trade their credits through automated bonding curves. 
        Early investors benefit from lower initial prices.
      </p>
      <ProjectGrid />
    </main>
  );
} 