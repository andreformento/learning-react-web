import { MOCK_WORKSPACES } from "./MockWorkspaces";

function WorkspacesPage() {
    return (
        <>
            <h1>Workspaces</h1>
            <pre>{JSON.stringify(MOCK_WORKSPACES, null, ' ')}</pre>
        </>
    )
}

export default WorkspacesPage;
