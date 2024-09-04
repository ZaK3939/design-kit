'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GitHubLogoIcon, TwitterLogoIcon, ClipboardIcon } from '@radix-ui/react-icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Project {
  name: string;
  designKitUrl: string;
  contact: string | null;
  category: string | null;
  iconUrl: string | null;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const groupedProjects = filteredProjects.reduce((acc, project) => {
    const category = project.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Contact copied to clipboard!');
    });
  };

  return (
    <div className='min-h-screen flex flex-col dark:bg-gray-900'>
      <header className='bg-gray-100 dark:bg-gray-800 py-4'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <h1 className='text-3xl font-bold dark:text-white'>Base Dapps Design Kit</h1>
          <div className='flex items-center space-x-4'>
            <ThemeToggle />
            <a
              href='https://github.com/ZaK3939/design-kit'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            >
              <GitHubLogoIcon className='w-6 h-6' />
              <span className='hidden sm:inline'>View on GitHub</span>
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
          onChange={(e) => handleSearch(e.target.value)}
        />

        {Object.entries(groupedProjects).map(([category, categoryProjects]) => (
          <div key={category} className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 dark:text-white bg-gray-100 dark:bg-gray-800 p-2 rounded'>
              {category}
            </h2>
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4'>
              {categoryProjects.map((project) => (
                <div
                  key={project.name}
                  className='flex flex-col items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer'
                  onClick={() => setSelectedProject(project)}
                >
                  <Image
                    src={project.iconUrl || '/icons/placeholder.png'}
                    alt={project.name}
                    width={48}
                    height={48}
                    className='mb-2'
                  />
                  <p className='text-xs font-medium dark:text-white text-center'>{project.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent>
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedProject.name}</DialogTitle>
                </DialogHeader>
                <div className='flex items-center space-x-4 mt-4'>
                  <Image
                    src={selectedProject.iconUrl || '/icons/placeholder.png'}
                    alt={selectedProject.name}
                    width={64}
                    height={64}
                  />
                  <div>
                    <div className='flex items-center space-x-2 mb-2'>
                      <a
                        href={selectedProject.designKitUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-500 hover:underline'
                      >
                        🎨 Design Kit
                      </a>
                    </div>
                    {selectedProject.contact && (
                      <div className='flex items-center space-x-2'>
                        <p className='text-sm'>{selectedProject.contact}</p>
                        <Button size='icon' variant='ghost' onClick={() => copyToClipboard(selectedProject.contact!)}>
                          <ClipboardIcon className='w-4 h-4' />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {filteredProjects.length === 0 && (
          <div className='text-center'>
            <p className='mb-4 dark:text-white'>No projects found. Would you like to add this project?</p>
            <Button asChild>
              <a href='https://github.com/ZaK3939/design-kit' target='_blank' rel='noopener noreferrer'>
                Submit a PR on GitHub
              </a>
            </Button>
          </div>
        )}
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
            <span className='hidden sm:inline'>Follow us on X</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
