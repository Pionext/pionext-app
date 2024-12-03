import projectsData from '@/data/projects.json';
import usersData from '@/data/users.json';

export function useProject(projectId: string) {
  const project = projectsData.projects.find(p => p.id === projectId);
  const user = project ? usersData.users.find(u => u.id === project.userId) : null;
  
  return {
    project: project ? { ...project, builder: user } : null,
    isLoading: false,
    error: project ? null : new Error('Project not found')
  };
} 