import { createProject } from '@/utils/canister';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const projectsPath = path.join(process.cwd(), 'data', 'projects.json');
    const creditsPath = path.join(process.cwd(), 'data', 'credits.json');
    const usersPath = path.join(process.cwd(), 'data', 'users.json');
    
    // Read existing projects, credits, and get current user
    const [projectsContent, creditsContent, usersContent] = await Promise.all([
      fs.readFile(projectsPath, 'utf-8'),
      fs.readFile(creditsPath, 'utf-8'),
      fs.readFile(usersPath, 'utf-8')
    ]);
    
    const projectsData = JSON.parse(projectsContent);
    const creditsData = JSON.parse(creditsContent);
    const usersData = JSON.parse(usersContent);

    // Get the current user (most recently logged in)
    const currentUser = usersData.users.reduce((latest: any, current: any) => {
      if (!latest || new Date(current.joinedAt) > new Date(latest.joinedAt)) {
        return current;
      }
      return latest;
    }, null);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'No authenticated user found' },
        { status: 401 }
      );
    }
    
    // Create new project with the current user's ID
    const newProject = {
      id: `proj_${projectsData.projects.length + 1}`,
      ...data,
      launchDate: new Date().toISOString().split('T')[0],
      status: "Active",
      userId: currentUser.id,
    };
    
    // Create associated credits
    const newCredits = {
      id: `cred_${creditsData.credits.length + 1}`,
      projectId: newProject.id,
      symbol: data.creditSymbol,
      name: `${data.name} Credits`,
      targetPrice: 1,
      currentSupply: 0,
      maxSupply: data.maxSupply
    };
    
    // Update both files
    projectsData.projects.push(newProject);
    creditsData.credits.push(newCredits);
    
    await Promise.all([
      fs.writeFile(projectsPath, JSON.stringify(projectsData, null, 2)),
      fs.writeFile(creditsPath, JSON.stringify(creditsData, null, 2))
    ]);
  
    await createProject(newProject, newCredits);
    
    return NextResponse.json({ project: newProject, credits: newCredits });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 
