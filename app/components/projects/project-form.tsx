"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateProject } from '@/hooks/use-create-project';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateTotalRaise, getBondingCurvePoints, calculateCurrentRaise, calculateRequiredMaxSupply } from "@/utils/bonding-curve";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().min(50, {
    message: "Project description must be at least 50 characters.",
  }),
  creditSymbol: z.string().min(1).max(4).toUpperCase(),
  targetRaise: z.number().min(1000, {
    message: "Minimum fundraising target is $1,000",
  }),
  image: z.object({
    url: z.string().url({ message: "Please enter a valid image URL" }),
    alt: z.string().optional()
  }).optional(),
  materials: z.array(z.object({
    title: z.string().min(1, { message: "Title is required" }),
    url: z.string().url({ message: "Please enter a valid URL" }),
    type: z.enum(["PDF", "Video", "Website", "Other"])
  })).min(1, { message: "At least one supporting material is required" }),
  details: z.object({
    problemSolution: z.object({
      problem: z.string().min(50, {
        message: "Problem description must be at least 50 characters."
      }),
      solution: z.string().min(50, {
        message: "Solution description must be at least 50 characters."
      })
    }),
    targetAudience: z.array(z.string()).min(1, {
      message: "At least one target audience is required"
    }),
    keyFeatures: z.array(z.object({
      title: z.string().min(1, { message: "Feature title is required" }),
      description: z.string().min(10, { message: "Feature description must be at least 10 characters" })
    })).min(1, { message: "At least one key feature is required" }),
    howItWorks: z.object({
      steps: z.array(z.string()).min(1, {
        message: "At least one step is required"
      })
    }),
    creditUsage: z.object({
      description: z.string().min(50, {
        message: "Please provide a detailed description of how credits can be used"
      }),
      examples: z.array(z.string()).min(1, {
        message: "Please provide at least one example of credit usage"
      })
    }),
    team: z.object({
      members: z.array(z.object({
        name: z.string().min(1, { message: "Team member name is required" }),
        role: z.string().min(1, { message: "Team member role is required" }),
        bio: z.string().min(50, { message: "Bio must be at least 50 characters" }),
        links: z.array(z.object({
          title: z.string(),
          url: z.string().url()
        })).optional()
      })).min(1, { message: "At least one team member is required" })
    }).optional()
  })
});

type FormData = z.infer<typeof formSchema>;

export function ProjectForm() {
  const router = useRouter();
  const { user } = useAuth();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      creditSymbol: "",
      targetRaise: 0,
      materials: [],
      details: {
        problemSolution: {
          problem: "",
          solution: ""
        },
        targetAudience: [],
        keyFeatures: [],
        howItWorks: {
          steps: []
        },
        creditUsage: {
          description: "",
          examples: []
        },
        team: {
          members: []
        }
      }
    }
  });

  const { createProject, isLoading, error } = useCreateProject();

  const onSubmit = async (data: FormData) => {
    console.log('Submit triggered with data:', data);
    try {
      if (!data.name || !data.description || !data.creditSymbol || !data.targetRaise) {
        console.error('Missing required fields:', { data });
        alert('Please fill in all required fields');
        return;
      }

      const result = await createProject({
        name: data.name,
        description: data.description,
        creditSymbol: data.creditSymbol,
        targetRaise: data.targetRaise,
        image: data.image,
        materials: data.materials,
        details: data.details
      });
    
      if (result) {
        console.log('Project created successfully:', result);
        router.push("/projects");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      alert(error instanceof Error ? error.message : 'Failed to create project');
    }
  };

  const addMaterial = () => {
    const currentMaterials = form.getValues("materials");
    form.setValue("materials", [
      ...currentMaterials,
      { title: "", url: "", type: "Website" }
    ]);
  };

  const maxSupply = calculateRequiredMaxSupply(form.watch("targetRaise") || 0);
  const bondingCurvePoints = getBondingCurvePoints({ currentSupply: 0, maxSupply });
  const potentialRaise = calculateTotalRaise({ currentSupply: 0, maxSupply });

  // Track form completion for each tab
  const watchedFields = form.watch();
  const isBasicsComplete = Boolean(
    watchedFields.name && 
    watchedFields.description
  );
  
  const isDetailsComplete = Boolean(
    watchedFields.details?.problemSolution?.problem &&
    watchedFields.details?.problemSolution?.solution &&
    (watchedFields.details?.targetAudience?.length ?? 0) > 0
  );

  const isFeaturesComplete = Boolean(
    (watchedFields.details?.keyFeatures?.length ?? 0) > 0 &&
    watchedFields.details?.keyFeatures?.every(f => f?.title && f?.description) &&
    (watchedFields.details?.howItWorks?.steps?.length ?? 0) > 0
  );

  const isCreditsComplete = Boolean(
    watchedFields.creditSymbol && 
    watchedFields.targetRaise > 0 &&
    watchedFields.details?.creditUsage?.description &&
    (watchedFields.details?.creditUsage?.examples?.length ?? 0) > 0
  );

  const teamMembers = watchedFields.details?.team?.members ?? [];
  const isTeamComplete = Boolean(
    teamMembers.length > 0 &&
    teamMembers.every(m => m?.name && m?.role && m?.bio)
  );

  return (
    <Form {...form}>
      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          if (!user) {
            router.push('/login');
            return;
          }
          console.log('Form submission started');
          const isValid = await form.trigger();
          console.log('Form validation result:', isValid);
          console.log('Form errors:', form.formState.errors);
          
          if (!isValid) {
            console.log('Form validation failed');
            // Show all validation errors to the user
            const errorMessages = Object.entries(form.formState.errors)
              .map(([key, value]) => `${key}: ${value.message}`)
              .join('\n');
            alert(`Please fix the following errors:\n${errorMessages}`);
            return;
          }
          
          console.log('Form data:', form.getValues());
          console.log('Calling onSubmit');
          await form.handleSubmit(onSubmit)(e);
        }} 
        className="space-y-8"
      >
        <Tabs defaultValue="basics" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basics" className="relative">
              Basics
              {isBasicsComplete && (
                <div className="absolute -right-1 -top-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="details" className="relative">
              Details
              {isDetailsComplete && (
                <div className="absolute -right-1 -top-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="features" className="relative">
              Features
              {isFeaturesComplete && (
                <div className="absolute -right-1 -top-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="credits" className="relative">
              Credits
              {isCreditsComplete && (
                <div className="absolute -right-1 -top-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="team" className="relative">
              Team
              {isTeamComplete && (
                <div className="absolute -right-1 -top-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Start with the essential information about your project.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Choose a clear and memorable name for your project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write a comprehensive description of your project"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A detailed description of your project that will appear in both project cards and the project details page
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Supporting Materials</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addMaterial}
                    >
                      Add Material
                    </Button>
                  </div>
                  {form.watch("materials").map((_, index) => (
                    <div key={index} className="grid gap-4 p-4 border rounded-lg">
                      <FormField
                        control={form.control}
                        name={`materials.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Whitepaper, Demo Video" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`materials.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`materials.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PDF">PDF</SelectItem>
                                <SelectItem value="Video">Video</SelectItem>
                                <SelectItem value="Website">Website</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <FormDescription>
                    Add links to supporting materials like whitepapers, videos, or documentation
                  </FormDescription>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Explain the problem you're solving and who you're helping.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="details.problemSolution.problem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What problem are you solving?"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Clearly describe the problem or pain point that your project addresses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="details.problemSolution.solution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solution</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How does your project solve this problem?"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain how your project solves the problem and what makes your approach unique
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Target Audience</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const current = form.getValues("details.targetAudience");
                        form.setValue("details.targetAudience", [...current, ""]);
                      }}
                    >
                      Add Audience
                    </Button>
                  </div>
                  {form.watch("details.targetAudience").map((_, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`details.targetAudience.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Who will use your project?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormDescription>
                    Describe the specific groups of users who will benefit from your project
                  </FormDescription>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Features & Implementation</CardTitle>
                <CardDescription>
                  Detail the key features and how your project works.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Key Features</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const current = form.getValues("details.keyFeatures");
                        form.setValue("details.keyFeatures", [...current, { title: "", description: "" }]);
                      }}
                    >
                      Add Feature
                    </Button>
                  </div>
                  {form.watch("details.keyFeatures").map((_, index) => (
                    <div key={index} className="grid gap-4">
                      <FormField
                        control={form.control}
                        name={`details.keyFeatures.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Feature name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`details.keyFeatures.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Feature description"
                                rows={2}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>How It Works</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const current = form.getValues("details.howItWorks.steps");
                        form.setValue("details.howItWorks.steps", [...current, ""]);
                      }}
                    >
                      Add Step
                    </Button>
                  </div>
                  {form.watch("details.howItWorks.steps").map((_, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`details.howItWorks.steps.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={`Step ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormDescription>
                    Break down how your project works into clear, sequential steps
                  </FormDescription>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credits">
            <Card>
              <CardHeader>
                <CardTitle>Credit System</CardTitle>
                <CardDescription>
                  Configure your project's credit system and explain how credits can be used.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="creditSymbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Symbol</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. PION"
                            {...field}
                            onChange={e => field.onChange(e.target.value.toUpperCase())}
                            maxLength={4}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum 4 characters, automatically uppercase
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetRaise"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fundraising Target (USD)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1000"
                            step="1000"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          This will create {maxSupply.toLocaleString()} credits
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="details.creditUsage.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Usage</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain how credits can be used in your project (e.g., '1 credit = 1 AI generation', 'Credits can be used for monthly subscription')"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a clear explanation of what users can do with your project's credits
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Usage Examples</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const current = form.getValues("details.creditUsage.examples");
                        form.setValue("details.creditUsage.examples", [...current, ""]);
                      }}
                    >
                      Add Example
                    </Button>
                  </div>
                  {form.watch("details.creditUsage.examples").map((_, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`details.creditUsage.examples.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., '10 credits = 1 month premium access'"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {maxSupply > 0 && (
                  <div className="space-y-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={bondingCurvePoints}>
                          <XAxis 
                            dataKey="supply" 
                            tickFormatter={(value) => `${value.toLocaleString()}`}
                          />
                          <YAxis 
                            tickFormatter={(value) => `$${value.toFixed(2)}`}
                          />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#0000FF" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="font-medium mb-2">How it works</h4>
                      <p className="text-sm text-muted-foreground">
                        Credits use a bonding curve where the price increases as more credits are bought. 
                        Early supporters get better prices.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        With {maxSupply.toLocaleString()} total credits, you could raise up to ${potentialRaise.toLocaleString(undefined, {
                          maximumFractionDigits: 2
                        })} if all credits are sold.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Add the key people behind your project.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Team Members</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const current = form.getValues("details.team.members") || [];
                        form.setValue("details.team.members", [...current, { 
                          name: "", 
                          role: "", 
                          bio: "",
                          links: []
                        }]);
                      }}
                    >
                      Add Team Member
                    </Button>
                  </div>
                  {form.watch("details.team.members")?.map((_, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg">
                      <FormField
                        control={form.control}
                        name={`details.team.members.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`details.team.members.${index}.role`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Founder, Developer, Designer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`details.team.members.${index}.bio`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief bio highlighting relevant experience"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <FormLabel>Links</FormLabel>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const current = form.getValues(`details.team.members.${index}.links`) || [];
                              form.setValue(`details.team.members.${index}.links`, [...current, { 
                                title: "", 
                                url: "" 
                              }]);
                            }}
                          >
                            Add Link
                          </Button>
                        </div>
                        {form.watch(`details.team.members.${index}.links`)?.map((_, linkIndex) => (
                          <div key={linkIndex} className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`details.team.members.${index}.links.${linkIndex}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="e.g. LinkedIn, Twitter" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`details.team.members.${index}.links.${linkIndex}.url`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="https://" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/projects")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            variant="outline"
            className={cn(
              "border-[#0000FF] text-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-colors",
              "disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            {!user ? "Sign in to Create Project" : isLoading ? "Creating Project..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 