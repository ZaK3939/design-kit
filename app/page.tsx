'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GitHubLogoIcon, TwitterLogoIcon, ClipboardIcon } from '@radix-ui/react-icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

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
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500'>
      <header className='bg-white dark:bg-gray-900 shadow-md py-4 transition-colors duration-500'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500'>
            Base Dapps Design Kit
          </h1>
          <div className='flex items-center space-x-4'>
            <ThemeToggle />
            <a
              href='https://github.com/ZaK3939/design-kit'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-300'
            >
              <GitHubLogoIcon className='w-6 h-6' />
              <span className='hidden sm:inline'>View on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main className='flex-grow container mx-auto px-4 py-8'>
        <Input
          className='mb-12 max-w-md mx-auto shadow-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-300'
          type='text'
          placeholder='Search projects...'
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {Object.entries(groupedProjects).map(([category, categoryProjects]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mb-16'
          >
            <h2 className='text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 dark:border-purple-500 pb-2 inline-block'>
              {category}
            </h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8'>
              {categoryProjects.map((project) => (
                <motion.div
                  key={project.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-xl'
                  onClick={() => setSelectedProject(project)}
                >
                  <Image
                    src={project.iconUrl || '/icons/placeholder.png'}
                    alt={project.name}
                    width={64}
                    height={64}
                    className='mb-4 rounded-full'
                  />
                  <p className='text-sm font-medium text-gray-800 dark:text-gray-200 text-center'>{project.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className='bg-white dark:bg-gray-800 rounded-lg shadow-2xl'>
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
                    {selectedProject.name}
                  </DialogTitle>
                </DialogHeader>
                <div className='flex items-center space-x-6 mt-6'>
                  <Image
                    src={selectedProject.iconUrl || '/icons/placeholder.png'}
                    alt={selectedProject.name}
                    width={96}
                    height={96}
                    className='rounded-full shadow-lg'
                  />
                  <div>
                    <a
                      href={selectedProject.designKitUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300'
                    >
                      🎨 View Design Kit
                    </a>
                    {selectedProject.contact && (
                      <div className='mt-4 flex items-center space-x-2'>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{selectedProject.contact}</p>
                        <Button
                          size='icon'
                          variant='outline'
                          onClick={() => copyToClipboard(selectedProject.contact!)}
                          className='hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300'
                        >
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
          <div className='text-center mt-12'>
            <p className='mb-4 text-gray-600 dark:text-gray-400'>
              No projects found. Would you like to add this project?
            </p>
            <Button asChild className='bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-300'>
              <a href='https://github.com/ZaK3939/design-kit' target='_blank' rel='noopener noreferrer'>
                Submit a PR on GitHub
              </a>
            </Button>
          </div>
        )}
      </main>

      <footer className='bg-white dark:bg-gray-900 py-6 mt-8 shadow-inner transition-colors duration-500'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <p className='text-gray-600 dark:text-gray-400'>&copy; 2024 Crypto Design Kit</p>
          <a
            href='https://x.com/W3ArtistNews'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300'
          >
            <TwitterLogoIcon className='w-6 h-6' />
            <span className='hidden sm:inline'>Follow us on X</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
