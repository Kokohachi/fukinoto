import path from 'path';
import { promises as fs } from 'fs';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const file = await fs.readFile(path.join(process.cwd(), 'pages', 'api','sonolus', 'info.json'), 'utf8');
    const jsoned = JSON.parse(file);
    res.status(200).json(jsoned);
  }
