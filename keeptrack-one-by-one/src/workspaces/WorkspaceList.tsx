import React from "react";
import { Workspace } from "./Workspace";

interface WorkspaceListProps {
    workspaces: Workspace[];
}

const WorkspaceList: React.FC<WorkspaceListProps> = ({workspaces}) => {
    return <pre>{JSON.stringify(workspaces, null, ' ')}</pre>;
}

export default WorkspaceList;
