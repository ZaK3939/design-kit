import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

type Project = {
  name: string;
  designKitUrl: string;
  contact: string | null;
};

type ApiResponse = Project[] | { message: string; suggestion: string; githubUrl: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'projects.json');
      const fileContents = await fs.readFile(filePath, 'utf8');
      const projects: Project[] = JSON.parse(fileContents);

      const { q } = req.query;
      if (q && typeof q === 'string') {
        const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(q.toLowerCase()));

        if (filteredProjects.length > 0) {
          res.status(200).json(filteredProjects);
        } else {
          res.status(200).json({
            message: 'No projects found matching your search.',
            suggestion:
              'If you know of a project that should be listed, please consider submitting a PR to our GitHub repository.',
            githubUrl: 'https://github.com/ZaK3939/design-kit',
          });
        }
      } else {
        res.status(200).json({
          message: 'Please provide a search query to find projects.',
          suggestion: 'You can also contribute by submitting new projects to our GitHub repository.',
          githubUrl: 'https://github.com/ZaK3939/design-kit',
        });
      }
    } catch (error) {
      console.error('Error reading projects file:', error);
      res.status(500).json({
        message: 'An error occurred while searching for projects. Please try again later.',
        suggestion: 'If this issue persists, please report it on our GitHub repository.',
        githubUrl: 'https://github.com/ZaK3939/design-kit',
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
