import creditsData from '@/data/credits.json';

export function useProjectCredits(projectId: string) {
  const credits = creditsData.credits.find(c => c.projectId === projectId);
  
  return {
    credits,
    isLoading: false,
    error: credits ? null : new Error('Credits not found')
  };
} 