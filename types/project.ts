export type MaterialType = "PDF" | "Video" | "Website" | "Other";
export type ProjectStatus = "Active" | "Completed" | "Upcoming";

export interface ProjectDetails {
  abstract?: string;
  problemSolution?: {
    problem: string;
    solution: string;
  };
  targetAudience?: string[];
  keyFeatures?: {
    title: string;
    description: string;
  }[];
  howItWorks?: {
    steps: string[];
  };
  creditUsage?: {
    free: string[];
    premium: {
      price: number;
      features: string[];
    };
  };
  team?: {
    members: {
      name: string;
      role: string;
      bio: string;
      links?: {
        title: string;
        url: string;
      }[];
    }[];
  };
  categories?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  image?: {
    url: string;
    alt?: string;
  };
  launchDate: string;
  status: ProjectStatus;
  materials: {
    title: string;
    url: string;
    type: MaterialType;
  }[];
  builder?: {
    id: string;
    username: string;
    name: string;
    email: string;
    bio?: string;
    role: "builder" | "user";
  };
  details?: ProjectDetails;
} 