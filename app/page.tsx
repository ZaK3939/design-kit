'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
    <div className='min-h-screen flex flex-col dark:bg-gray-900'>
      <header className='bg-gray-100 dark:bg-gray-800 py-4'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <h1 className='text-3xl font-bold dark:text-white'>Crypto Design Kit</h1>
          <div className='flex items-center space-x-4'>
            <ThemeToggle />
            <a
              href='https://github.com/ZaK3939/design-kit'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            >
              <GitHubLogoIcon className='w-6 h-6' />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main className='flex-grow container mx-auto px-4 py-8'>
        <Input
          className='mb-6 max-w-md mx-auto'
          type='text'
          placeholder='Search projects...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredProjects.map((project) => (
            <Card key={project.name} className='flex flex-col justify-between dark:bg-gray-800'>
              <CardHeader>
                <CardTitle className='text-xl dark:text-white'>{project.name}</CardTitle>
                {project.contact && (
                  <CardDescription className='text-sm dark:text-gray-300'>Contact: {project.contact}</CardDescription>
                )}
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
      </main>

      <footer className='bg-gray-100 dark:bg-gray-800 py-4 mt-8'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <p className='dark:text-white'>&copy; 2024 Crypto Design Kit</p>
          <a
            href='https://x.com/W3ArtistNews'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          >
            <TwitterLogoIcon className='w-6 h-6' />
            <span>Follow us on X</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
