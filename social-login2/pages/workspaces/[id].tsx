import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import Router from "next/router";
import { WorkspaceProps } from "../../components/Workspace";
import prisma from '../../lib/prisma'
import { useSession } from "next-auth/react";


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      owner: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: workspace,
  };
};

async function publishWorkspace(id: number): Promise<void> {
  await fetch(`/api/workspaces/${id}`, {
    method: "PUT",
  });
  await Router.push("/")
}

async function deleteWorkspace(id: number): Promise<void> {
  await fetch(`/api/workspaces/${id}`, {
    method: "DELETE",
  });
  await Router.push("/")
}

const Workspace: React.FC<WorkspaceProps> = (props) => {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const workspaceBelongsToUser = session?.user?.email === props.owner?.email;
  let title = props.title;
  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.owner?.name || "Unknown owner"}</p>
        
        {userHasValidSession && workspaceBelongsToUser && (
          <button onClick={() => deleteWorkspace(props.id)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Workspace;
