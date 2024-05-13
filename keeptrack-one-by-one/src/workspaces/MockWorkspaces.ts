import { Workspace } from './Workspace';

export const MOCK_WORKSPACES = [
    new Workspace({
        id: "5587a0a6-156c-4bbf-b12e-ad3768173016",
        description: "Eddie",
        typeId: 2,
        creationDate: '2023-06-05T20:39:41.473Z',
        budget: 456,
        isActive: true,
    }),
    new Workspace({
        id: "d9e3a8c0-2713-4c8d-8a89-f02dd6144f42",
        description: "Vovo Juju",
        typeId: 27,
        creationDate: '2023-03-14T09:39:41.273Z',
        budget: 964,
        isActive: true,
    }),
    new Workspace({
        id: "46c23d23-fa0e-4b33-aa0e-ed6e3c46b282",
        description: "Iron Maiden",
        typeId: 666,
        creationDate: '2023-03-15T10:39:41.273Z',
        budget: 964,
        isActive: true,
    }),
    new Workspace({
        id: "5f36df00-823f-409e-9428-9b980156a5b5",
        description: "Not active",
        typeId: 5,
        creationDate: '2023-03-13T09:50:41.273Z',
        budget: 11,
        isActive: false,
    }),
]
