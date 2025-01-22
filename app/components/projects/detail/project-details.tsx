"use client";

import { ProjectDetails as ProjectDetailsType } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ProjectDetailsProps {
  details: ProjectDetailsType;
}

export function ProjectDetails({ details }: ProjectDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!details) return null;

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>More Details</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isExpanded && (
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="economics">Economics</TabsTrigger>
                {details.team && <TabsTrigger value="team">Team</TabsTrigger>}
              </TabsList>

              <TabsContent value="about" className="space-y-6 mt-6">
                {details.problemSolution && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Problem & Solution</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Problem</h4>
                        <p className="text-gray-600">{details.problemSolution.problem}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Solution</h4>
                        <p className="text-gray-600">{details.problemSolution.solution}</p>
                      </div>
                    </div>
                  </div>
                )}

                {details.targetAudience && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Target Audience</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {details.targetAudience.map((audience, index) => (
                        <li key={index}>{audience}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="features" className="space-y-6 mt-6">
                {details.keyFeatures && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                    <div className="grid gap-4">
                      {details.keyFeatures.map((feature, index) => (
                        <div key={index} className="space-y-1">
                          <h4 className="font-medium text-gray-900">{feature.title}</h4>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {details.howItWorks && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      {details.howItWorks.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="economics" className="space-y-6 mt-6">
                {details.creditUsage && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Credit Usage</h3>
                    <div className="prose prose-sm max-w-none">
                      <p>{details.creditUsage.description}</p>
                      <ul>
                        {details.creditUsage.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </TabsContent>

              {details.team && (
                <TabsContent value="team" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Team Members</h3>
                    <div className="grid gap-6">
                      {details.team.members.map((member, index) => (
                        <div key={index} className="space-y-2">
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
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 