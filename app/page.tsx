'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface Project {
  name: string;
  designKitUrl: string;
  contact: string | null;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/projects.json');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold mb-8 text-center'>Crypto Design Kit Manager</h1>

      <Input
        className='mb-6 max-w-md mx-auto'
        type='text'
        placeholder='Search projects...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredProjects.map((project) => (
          <Card key={project.name} className='flex flex-col justify-between'>
            <CardHeader>
              <CardTitle className='text-xl'>{project.name}</CardTitle>
              {project.contact && <CardDescription className='text-sm'>Contact: {project.contact}</CardDescription>}
            </CardHeader>
            <CardContent className='flex-grow'>{/* You can add more project details here if needed */}</CardContent>
            <CardFooter className='flex justify-between'>
              <Button asChild>
                <a href={project.designKitUrl} target='_blank' rel='noopener noreferrer'>
                  View Design Kit
                </a>
              </Button>
              {project.contact && (
                <Button variant='outline' asChild>
                  <a href={`mailto:${project.contact}`}>Contact</a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
