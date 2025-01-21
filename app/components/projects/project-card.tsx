"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { calculatePrice } from "@/utils/bonding-curve";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    amountRaised: number;
    fundingGoal: number;
    status: "Active" | "Completed" | "Upcoming";
    image?: {
      url: string;
      alt?: string;
    };
    currentSupply?: number;
    maxSupply?: number;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const progress = (project.amountRaised / project.fundingGoal) * 100;

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!project.currentSupply || !project.maxSupply) return null;
    const currentPrice = calculatePrice(project.currentSupply, {
      currentSupply: project.currentSupply,
      maxSupply: project.maxSupply,
    });
    const discount = ((1 - currentPrice) * 100).toFixed(0);
    return parseInt(discount) > 0 ? discount : null;
  };

  const discount = calculateDiscount();

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      {project.image && (
        <div className="relative w-full aspect-video">
          <Image
            src={project.image.url}
            alt={project.image.alt || project.name}
            fill
            className="object-cover rounded-t-lg"
            priority
          />
        </div>
      )}
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{project.name}</h3>
          {discount && (
            <Badge className="bg-[#0000FF]">{discount}% OFF</Badge>
          )}
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Funding</span>
            <span className="font-medium">
              {Number.isFinite(project.amountRaised) && Number.isFinite(project.fundingGoal)
                ? `$${project.amountRaised.toLocaleString(undefined, { maximumFractionDigits: 2 })} / $${project.fundingGoal.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "N/A"}
            </span>
          </div>
          <Progress value={Number.isFinite(progress) ? progress : 0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
} 