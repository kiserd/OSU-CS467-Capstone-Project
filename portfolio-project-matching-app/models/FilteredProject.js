import { Project } from './Project'

class FilteredProject {

    constructor(project, technology) {
        this.project = project;
        this.filters = [technology];
    }

    addFilter(technology) {
        if (!this.hasTechnology(technology.id)) {
            this.filters.push(technology);
        }
    }

    removeFilter(technology) {
        if (!this.hasTechnology(technology.id)) {
            this.filters = this.filters.filter((element) => element.id !== technology.id);
        }
    }

    filtersIsEmpty() {
        return this.filters.length === 0;
    }

    hasTechnology(technologyId) {
        // return false for null technologies property
        if (this.technologiesIsEmpty()) {
            return false;
        }

        // loop through technologies in search of technologyId
        for (const technology of this.project.technologies) {
            if (technology.id === technologyId) {
                return true;
            }
        }
        // search failed, return false
        return false;
    }

    technologiesIsEmpty() {
        return this.project.technologies === null || this.project.technologies.length === 0;
    }
}


export { FilteredProject }