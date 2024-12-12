"use client";

import { Badge } from "@/components/ui/badge";
import { useProjectCredits } from "@/hooks/use-project-credits";
import { calculatePrice } from "@/utils/bonding-curve";
import { cn } from "@/lib/utils";

interface ProjectHeaderProps {
  projectId: string;
  name: string;
  launchDate: string;
  status: "Active" | "Completed" | "Upcoming";
}

export function ProjectHeader({ projectId, name, launchDate, status }: ProjectHeaderProps) {
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
      <Badge 
        variant={status === "Active" ? "default" : "secondary"}
        className={cn(
          "w-fit",
          status === "Active" && "bg-[#0000FF] hover:bg-[#0000FF]/80"
        )}
      >
        {status}
      </Badge>
    </div>
  );
} 