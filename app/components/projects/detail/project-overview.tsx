"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useProjectCredits } from "@/hooks/use-project-credits";
import { calculateCurrentRaise, calculateTotalRaise } from "@/utils/bonding-curve";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

interface ProjectOverviewProps {
  project: Project;
}

type TabType = "overview" | "about" | "features" | "economics" | "team";

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const { credits } = useProjectCredits(project.id);
  const currentRaise = credits ? calculateCurrentRaise(credits) : 0;
  const totalRaise = credits ? calculateTotalRaise(credits) : 0;
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "about" as const, label: "Mission" },
    { id: "features" as const, label: "Features" },
    { id: "economics" as const, label: "Economics" },
    ...(project.details?.team ? [{ id: "team" as const, label: "Team" }] : []),
  ];

  return (
    <Card>
      <CardContent className="p-6">
        {/* Custom Tab Navigation */}
        <div className="border-b mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-2 -mb-px text-sm font-medium transition-colors relative",
                  activeTab === tab.id
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Project Image */}
            {project.image && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={project.image.url}
                  alt={project.image.alt || project.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <p className="text-gray-600">{project.description}</p>
              </div>
              <div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Project Stats</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Raise</p>
                      <p className="text-2xl font-bold">${currentRaise.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Raise</p>
                      <p className="text-2xl font-bold">${totalRaise.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Launch Date</p>
                      <p className="text-lg font-semibold">
                        {new Date(project.launchDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-lg font-semibold capitalize">{project.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supporting Materials */}
            {project.materials && project.materials.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Supporting Materials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.materials.map((material, index) => (
                    <a
                      key={index}
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{material.title}</p>
                        <p className="text-sm text-gray-500 capitalize">{material.type}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="space-y-8">
            {/* Problem & Solution */}
            {project.details?.problemSolution && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Problem & Solution</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Problem</h4>
                    <p className="text-gray-600">{project.details.problemSolution.problem}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Solution</h4>
                    <p className="text-gray-600">{project.details.problemSolution.solution}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Target Audience */}
            {project.details?.targetAudience && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Target Audience</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    {project.details.targetAudience.map((audience, index) => (
                      <li key={index}>{audience}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <div className="space-y-6">
            {project.details?.keyFeatures && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                <div className="grid gap-4">
                  {project.details.keyFeatures.map((feature, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg space-y-2">
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.details?.howItWorks && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    {project.details.howItWorks.steps.map((step, index) => (
                      <li key={index} className="pl-2">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Economics Tab */}
        {activeTab === "economics" && (
          <div className="space-y-6">
            {project.details?.creditUsage && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Credit Usage</h3>
                <div className="grid gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Free Features</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {project.details.creditUsage.free.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Premium Features (${project.details.creditUsage.premium.price}/month)
                    </h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {project.details.creditUsage.premium.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && project.details?.team && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>
              <div className="grid gap-6">
                {project.details.team.members.map((member, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg space-y-2">
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-500">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                    {member.links && member.links.length > 0 && (
                      <div className="flex gap-2">
                        {member.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {link.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 