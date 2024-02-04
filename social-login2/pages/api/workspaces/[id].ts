import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'


// DELETE /api/workspace/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const workspaceId = req.query.id;

  const session = await getSession({ req })

  if (req.method === "DELETE") {
    if (session) {
      const workspace = await prisma.workspace.delete({
        where: { id: Number(workspaceId) },
      });
      res.json(workspace);
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
