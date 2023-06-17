import { Fragment, useState } from "react";
import { MOCK_PROJECTS } from "./MockProject";
import { Project } from "./Project";
import ProjectList from "./ProjectList";

function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

    const saveProject = (project: Project) => {
        let updatedProjects = projects.map((p: Project) => {
            return p.id === project.id ? project : p;
        });
        setProjects(updatedProjects);
    };

    return (
        <Fragment>
            <h1>Projects</h1>
            <ProjectList
                projects={projects}
                onSave={saveProject} />
        </Fragment>
    );
}

export default ProjectsPage;
