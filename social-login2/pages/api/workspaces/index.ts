import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';

// WORKSPACE /api/workspace
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { title } = req.body;

  const session = await getServerSession(req, res, options);
  if (session) {
    const result = await prisma.workspace.create({
      data: {
        title: title,
        owner: { connect: { email: session?.user?.email } },
      },
    });
    res.json(result);
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}
