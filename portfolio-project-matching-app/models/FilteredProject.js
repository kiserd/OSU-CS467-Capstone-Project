import { Project } from './Project'

class FilteredProject {

    constructor(project, technology) {
        this.project = project;
        this.filters = [technology];
    }

    addFilter(technology) {
        /*
        DESCRIPTION:    adds provided technology to filters array if applicable

        INPUT:          technology to be potentially added to filters array

        RETURN:         NA
        */
        if (!this.hasTechnology(technology.id)) {
            this.filters.push(technology);
        }
    }

    removeFilter(technology) {
        /*
        DESCRIPTION:    removes provided technology from filters array if
                        applicable

        INPUT:          technology to be potentially removed from filters array

        RETURN:         NA
        */
        if (!this.hasTechnology(technology.id)) {
            this.filters = this.filters.filter((element) => element.id !== technology.id);
        }
    }

    filtersIsEmpty() {
        /*
        DESCRIPTION:    indicates whether filters array is empty

        INPUT:          NA

        RETURN:         boolean indicating whether filters array is empty
        */
        return this.filters.length === 0;
    }

    hasTechnology(technologyId) {
        /*
        DESCRIPTION:    indicates whether technology associated with provided
                        technologyId is associated with project

        INPUT:          technology document ID

        RETURN:         boolean indicating whether technologyId is associated
                        with project
        */
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
        /*
        DESCRIPTION:    indicates whether project is associated with zero
                        technologies

        INPUT:          NA

        RETURN:         boolean indicating whether project is associated with
                        zero technologies
        */
        return this.project.technologies === null || this.project.technologies.length === 0;
    }
}


export { FilteredProject }