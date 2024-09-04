'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <header className='bg-card shadow-md py-4'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <Link href='/'>
            <Button variant='ghost' className='flex items-center'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Home
            </Button>
          </Link>
          <div className='flex items-center space-x-4'>
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
        <h1 className='text-4xl font-bold mb-8 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600'>
          About Base Dapps Design Kit
        </h1>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8'>
          <Card>
            <CardHeader>
              <CardTitle>Benefits for Users</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {[
                  'Easy comparison of design across protocols',
                  'Informed participation as an artist',
                  'Inspiration for derivative works',
                  'Quick verification of available design kits',
                  'Enhanced understanding of dapp ecosystems',
                ].map((item, index) => (
                  <li key={index} className='flex items-center space-x-2'>
                    <CheckCircle className='h-4 w-4 text-green-500' />
                    <span className='text-sm text-muted-foreground'>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Use This Resource</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className='space-y-2 list-decimal list-inside'>
                {[
                  'Browse design kits by category',
                  'Compare designs across different protocols',
                  'Check availability of design kits for specific dapps',
                  'Use as reference for your own designs or contributions',
                  'Contact project teams for collaboration opportunities',
                ].map((item, index) => (
                  <li key={index} className='text-sm text-muted-foreground'>
                    {item}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-start space-x-2 mb-4'>
                <AlertTriangle className='h-5 w-5 text-yellow-500 mt-0.5' />
                <p className='text-sm text-muted-foreground'>
                  Please be aware of copyright and intellectual property rights when using or referencing these design
                  kits.
                </p>
              </div>
              <ul className='space-y-2'>
                {[
                  'Always check the license of each design kit',
                  'Contact the project team if rights are unclear',
                  'Respect attribution requirements',
                  'Seek permission for commercial use if required',
                ].map((item, index) => (
                  <li key={index} className='flex items-center space-x-2'>
                    <CheckCircle className='h-4 w-4 text-green-500' />
                    <span className='text-sm text-muted-foreground'>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About This Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground mb-4'>
              The Base Dapps Design Kit is a comprehensive resource that allows users to easily check and compare design
              kits across various decentralized applications (dapps) and protocols. Our goal is to foster creativity,
              encourage collaboration, and streamline the process of understanding and utilizing design elements in the
              Web3 ecosystem.
            </p>
            <p className='text-sm text-muted-foreground'>
              Whether you are a designer, developer, or enthusiast, this platform provides valuable insights into the
              visual languages of different projects, enabling informed decisions and inspiring new creations. Remember
              to always respect intellectual property rights and reach out to project teams when in doubt about usage
              permissions.
            </p>
          </CardContent>
        </Card>
      </main>

      <footer className='bg-card py-6 mt-8 shadow-inner'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <p className='text-muted-foreground'>&copy; 2024 Base Dapps Design Kit</p>
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
