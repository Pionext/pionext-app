"use client";

import { useState } from 'react';
import projectsData from '@/data/projects.json';
import { calculateRequiredMaxSupply } from '@/utils/bonding-curve';

interface CreateProjectData {
  name: string;
  description: string;
  creditSymbol: string;
  targetRaise: number;
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
      const maxSupply = calculateRequiredMaxSupply(data.targetRaise);
      console.log('Sending data:', { ...data, maxSupply });
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          maxSupply,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to create project');
      }
      
      const newProject = await response.json();
      console.log('Created project:', newProject);
      return newProject;
    } catch (err) {
      console.error('Creation error:', err);
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