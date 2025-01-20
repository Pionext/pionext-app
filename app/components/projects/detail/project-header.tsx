"use client";

import { useProjectCredits } from "@/hooks/use-project-credits";
import { calculatePrice } from "@/utils/bonding-curve";

interface ProjectHeaderProps {
  projectId: string;
  name: string;
  launchDate: string;
}

export function ProjectHeader({ projectId, name, launchDate }: ProjectHeaderProps) {
  const { credits } = useProjectCredits(projectId);
  const currentPrice = credits ? calculatePrice(credits.currentSupply, credits) : 0;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">{name}</h1>
          {credits && (
            <span className="text-2xl font-semibold text-gray-600">
              ${currentPrice.toFixed(4)}
            </span>
          )}
        </div>
        <p className="text-gray-500 mt-2">
          Launched {new Date(launchDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
} 