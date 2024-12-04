"use client";

import { useState } from 'react';
import projectsData from '@/data/projects.json';

interface CreateProjectData {
  name: string;
  description: string;
  maxSupply: number;
  initialPrice: number;
  materials: {
    title: string;
    url: string;
    type: "PDF" | "Video" | "Website" | "Other";
  }[];
}

export function useCreateProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (data: CreateProjectData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create project');
      
      const newProject = await response.json();
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProject,
    isLoading,
    error,
  };
} 