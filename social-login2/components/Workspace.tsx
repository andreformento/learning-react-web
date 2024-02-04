import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type WorkspaceProps = {
  id: number;
  title: string;
  owner: {
    name: string;
    email: string;
  } | null;
};

const Workspace: React.FC<{ workspace: WorkspaceProps }> = ({ workspace }) => {
  const ownerName = workspace.owner ? workspace.owner.name : "Unknown workspace";
  return (
    <div onClick={() => Router.push("/workspaces/[id]", `/workspaces/${workspace.id}`)}>
      <h2>{workspace.title}</h2>
      <small>By {ownerName}</small>
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Workspace;
