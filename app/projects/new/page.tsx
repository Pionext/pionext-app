"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "../../components/projects/project-form";

export default function NewProjectPage() {
  const router = useRouter();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create New Project</h1>
        <ProjectForm />
      </div>
    </main>
  );
} 