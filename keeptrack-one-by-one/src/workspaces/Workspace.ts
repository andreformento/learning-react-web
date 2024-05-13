export class Workspace {
    id: String = '';
    description: String = '';
    typeId: number | undefined;
    creationDate: Date = new Date();
    budget: number = 0;
    isActive: boolean = false;

    get isNew(): Boolean {
        return (!this.id || this.id.length === 0 );
    }

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.id) this.id = initializer.id;
        if (initializer.description) this.description = initializer.description;
        if (initializer.typeId) this.typeId = initializer.typeId;
        if (initializer.creationDate) this.creationDate = new Date(initializer.creationDate);
        if (initializer.budget) this.budget = initializer.budget;
        if (initializer.isActive) this.isActive = initializer.isActive;
    }
}
