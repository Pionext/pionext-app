import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const projectsPath = path.join(process.cwd(), 'data', 'projects.json');
    const creditsPath = path.join(process.cwd(), 'data', 'credits.json');
    
    // Read existing projects and credits
    const [projectsContent, creditsContent] = await Promise.all([
      fs.readFile(projectsPath, 'utf-8'),
      fs.readFile(creditsPath, 'utf-8')
    ]);
    
    const projectsData = JSON.parse(projectsContent);
    const creditsData = JSON.parse(creditsContent);
    
    // Create new project
    const newProject = {
      id: `proj_${projectsData.projects.length + 1}`,
      ...data,
      launchDate: new Date().toISOString().split('T')[0],
      status: "Active",
      userId: "usr_1",
    };
    
    // Create associated credits
    const newCredits = {
      id: `cred_${creditsData.credits.length + 1}`,
      projectId: newProject.id,
      symbol: data.name.substring(0, 4).toUpperCase(),
      name: `${data.name} Credits`,
      targetPrice: data.initialPrice,
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
    
    return NextResponse.json({ project: newProject, credits: newCredits });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 