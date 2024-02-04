import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Workspace, { WorkspaceProps } from "../components/Workspace";
import { useSession, getSession } from "next-auth/react";
import prisma from '../lib/prisma'


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { workspaces: [] } };
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      owner: { email: session.user.email },
    },
    include: {
      owner: {
        select: { name: true },
      },
    },
  });
  return {
    props: { workspaces },
  };
};

type Props = {
  workspaces: WorkspaceProps[];
};

const Workspaces: React.FC<Props> = (props) => {
  const {data: session}= useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Workspaces</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Workspaces</h1>
        <main>
          {props.workspaces.map((workspace) => (
            <div key={workspace.id} className="workspace">
              <Workspace workspace={workspace} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .workspace {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .workspace:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .workspace + .workspace {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Workspaces;
