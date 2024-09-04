'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Project {
  name: string;
  designKitUrl: string;
  contact: string | null;
  category: string | null;
  iconUrl: string | null;
  description?: string;
}

const ProjectDialog = ({
  project,
  isOpen,
  onOpenChange,
}: {
  project: Project | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { toast } = useToast();

  if (!project) return null;

  const copyContact = () => {
    if (project.contact) {
      navigator.clipboard.writeText(project.contact);
      toast({
        title: 'Contact copied',
        description: 'The contact information has been copied to your clipboard.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src={project.iconUrl || ''} alt={project.name} />
              <AvatarFallback>{project.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{project.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {project.description && <p className='text-sm text-muted-foreground'>{project.description}</p>}
          {project.category && (
            <div className='flex items-center space-x-2'>
              <span className='text-sm font-medium'>Category:</span>
              <Badge variant='secondary'>{project.category}</Badge>
            </div>
          )}
          {project.contact && (
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>{project.contact}</span>
              <Button variant='outline' size='icon' onClick={copyContact}>
                <Copy className='h-4 w-4' />
              </Button>
            </div>
          )}
        </div>
        <Separator />
        <DialogFooter className='sm:justify-start'>
          <Button asChild className='w-full'>
            <a href={project.designKitUrl} target='_blank' rel='noopener noreferrer'>
              <ExternalLink className='mr-2 h-4 w-4' />
              View Design Kit
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [randomizedCategories, setRandomizedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/projects.json');
      const data = await response.json();
      setProjects(data);

      const categories = Array.from(new Set(data.map((project: Project) => project.category || 'Other'))) as string[];
      setRandomizedCategories(shuffleArray(categories));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <header className='bg-card shadow-md py-4'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600'>
            Base Dapps Design Kit
          </h1>
          <div className='flex items-center space-x-4'>
            <Link href='/about'>
              <Button variant='ghost'>About</Button>
            </Link>
            <ThemeToggle />
            <Button variant='ghost' asChild>
              <a
                href='https://github.com/ZaK3939/design-kit'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2'
              >
                <GitHubLogoIcon className='w-5 h-5' />
                <span className='hidden sm:inline'>View on GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className='flex-grow container mx-auto px-4 py-8'>
        <Input
          className='mb-12 max-w-md mx-auto'
          type='text'
          placeholder='Search projects...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {randomizedCategories.map((category) => {
          const categoryProjects = groupedProjects[category];
          if (!categoryProjects || categoryProjects.length === 0) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='mb-16'
            >
              <h2 className='text-3xl font-bold mb-8 text-foreground border-b-2 border-primary pb-2 inline-block'>
                {category}
              </h2>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8'>
                {categoryProjects.map((project) => (
                  <motion.div
                    key={project.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-card rounded-lg shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-xl'
                    onClick={() => setSelectedProject(project)}
                  >
                    <Image
                      src={project.iconUrl || '/icons/placeholder.png'}
                      alt={project.name}
                      width={64}
                      height={64}
                      className='mb-4 rounded-full'
                    />
                    <p className='text-sm font-medium text-foreground text-center'>{project.name}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}

        <ProjectDialog
          project={selectedProject}
          isOpen={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
        />

        {filteredProjects.length === 0 && (
          <div className='text-center mt-12'>
            <p className='mb-4 text-muted-foreground'>No projects found. Would you like to add this project?</p>
            <Button asChild>
              <a href='https://github.com/ZaK3939/design-kit' target='_blank' rel='noopener noreferrer'>
                Submit a PR on GitHub
              </a>
            </Button>
          </div>
        )}
      </main>
      <footer className='bg-card py-6 mt-8 shadow-inner'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <p className='text-muted-foreground'>&copy; 2024 Crypto Design Kit</p>
          <Button variant='ghost' asChild>
            <a
              href='https://x.com/W3ArtistNews'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-2'
            >
              <TwitterLogoIcon className='w-5 h-5' />
              <span className='hidden sm:inline'>Follow us on X</span>
            </a>
          </Button>
        </div>
      </footer>
    </div>
  );
}
