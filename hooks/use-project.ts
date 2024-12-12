import projectsData from '@/data/projects.json';
import usersData from '@/data/users.json';

export function useProject(projectId: string) {
  const project = projectsData.projects.find(p => p.id === projectId);
  const user = project ? usersData.users.find(u => u.id === project.userId) : null;
  
  if (user) {
    // Remove sensitive information
    const { passwordHash, ...userWithoutPassword } = user;
    return {
      project: project ? { ...project, builder: userWithoutPassword } : null,
      isLoading: false,
      error: project ? null : new Error('Project not found')
    };
  }
  
  return {
    project: project ? { ...project, builder: null } : null,
    isLoading: false,
    error: project ? null : new Error('Project not found')
  };
} 