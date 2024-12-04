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
import { calculateTotalRaise, getBondingCurvePoints, calculateCurrentRaise } from "@/utils/bonding-curve";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Project description must be at least 10 characters.",
  }),
  creditSymbol: z.string().min(1).max(4).toUpperCase(),
  maxSupply: z.number().min(1, {
    message: "Maximum supply must be greater than 0.",
  }),
  materials: z.array(z.object({
    title: z.string().min(1, { message: "Title is required" }),
    url: z.string().url({ message: "Please enter a valid URL" }),
    type: z.enum(["PDF", "Video", "Website", "Other"])
  }))
});

type FormData = z.infer<typeof formSchema>;

export function ProjectForm() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      creditSymbol: "",
      maxSupply: 0,
      materials: []
    }
  });

  const { createProject, isLoading, error } = useCreateProject();

  const onSubmit = async (data: FormData) => {
    try {
      await createProject(data);
      router.push("/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const addMaterial = () => {
    const currentMaterials = form.getValues("materials");
    form.setValue("materials", [
      ...currentMaterials,
      { title: "", url: "", type: "Website" }
    ]);
  };

  const maxSupply = form.watch("maxSupply");
  const bondingCurvePoints = getBondingCurvePoints({ currentSupply: 0, maxSupply });
  const potentialRaise = calculateTotalRaise({ currentSupply: 0, maxSupply });

  // Track form completion
  const watchedFields = form.watch();
  const isDetailsComplete = watchedFields.name && 
    watchedFields.description && 
    watchedFields.materials.length > 0;
  const isCreditsComplete = watchedFields.creditSymbol && 
    watchedFields.maxSupply > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center space-x-2 mb-4">
          <div className={`h-2 flex-1 rounded ${
            isDetailsComplete ? 'bg-blue-500' : 'bg-gray-200'
          }`} />
          <div className={`h-2 flex-1 rounded ${
            isCreditsComplete ? 'bg-blue-500' : 'bg-gray-200'
          }`} />
        </div>

        <Tabs defaultValue="details" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">
              Project Details
              {isDetailsComplete && 
                <span className="ml-2 text-green-500">✓</span>
              }
            </TabsTrigger>
            <TabsTrigger value="credits">
              Credit System
              {isCreditsComplete && 
                <span className="ml-2 text-green-500">✓</span>
              }
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Supporting Materials</FormLabel>
                    <Button type="button" variant="outline" onClick={addMaterial}>
                      Add Material
                    </Button>
                  </div>

                  {form.watch("materials").map((_, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`materials.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Title" {...field} />
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
                            <FormControl>
                              <Input placeholder="URL" {...field} />
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Website">Website</SelectItem>
                                <SelectItem value="PDF">PDF</SelectItem>
                                <SelectItem value="Video">Video</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credits">
            <Card>
              <CardHeader>
                <CardTitle>Credit System</CardTitle>
                <CardDescription>
                  Configure your project's credit system. Credits use a bonding curve mechanism 
                  where early supporters get better prices.
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
                    name="maxSupply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Supply</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const data = payload[0].payload;
                              const currentRaise = calculateCurrentRaise({
                                currentSupply: data.supply,
                                maxSupply
                              });

                              return (
                                <div className="rounded-lg border bg-white p-3 shadow-sm">
                                  <div className="grid gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Supply
                                      </span>
                                      <span className="font-bold">
                                        {Math.round(data.supply).toLocaleString()} credits
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Price
                                      </span>
                                      <span className="font-bold">
                                        ${data.price.toFixed(4)}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Total Raised
                                      </span>
                                      <span className="font-bold">
                                        ${currentRaise.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }}
                          />
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
            disabled={
              form.formState.isSubmitting || 
              !isDetailsComplete || 
              !isCreditsComplete
            }
          >
            {form.formState.isSubmitting 
              ? "Creating..." 
              : !isDetailsComplete 
                ? "Complete Project Details" 
                : !isCreditsComplete 
                  ? "Configure Credit System"
                  : "Create Project"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
} 