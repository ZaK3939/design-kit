import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

type Project = {
  name: string;
  designKitUrl: string;
  contact: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'projects.json');
      const fileContents = await fs.readFile(filePath, 'utf8');
      const projects: Project[] = JSON.parse(fileContents);

      const { q } = req.query;
      if (q && typeof q === 'string') {
        const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(q.toLowerCase()));
        res.status(200).json(filteredProjects);
      } else {
        res.status(400).json({ error: 'Search query is required' });
      }
    } catch (error) {
      console.error('Error reading projects file:', error);
      res.status(500).json({ error: 'Unable to fetch projects data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
