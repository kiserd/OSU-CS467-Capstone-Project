import { Project } from './Project'

class FilteredProject {
    // fields
    project;
    buttonFilters;
    searchFiltered;

    // static factory methods (used like overloaded constructors)
    static fromButton(project, technology) {
        /*
        DESCRIPTION:    constructs a FilteredProject object from a Project
                        object and a technology filter being applied to said
                        Project

        INPUT:          project (Project object): Project being filtered

                        technology (Technology object): Technology filter being
                        applied to Project object

        RETURN:         FilteredProject object with project property set and
                        technology filter added to buttonFilters array property
        */
        // instantiate new Project object
        const filteredProject = new FilteredProject();
        // set fields/properties based on provided id and snapshot
        filteredProject.project = project;
        filteredProject.buttonFilters = [technology];
        filteredProject.searchFiltered = false;
        // return to user
        return filteredProject;
    }

    static fromSearch(project) {
        /*
        DESCRIPTION:    constructs a FilteredProject object from a Project
                        object and sets searchFiltered property to true

        INPUT:          project (Project object): Project being filtered

        RETURN:         FilteredProject object with project property set and
                        searchFiltered property set to true
        */
        // instantiate new Project object
        const filteredProject = new FilteredProject();
        // set fields/properties based on provided id and snapshot
        filteredProject.project = project;
        filteredProject.buttonFilters = [];
        filteredProject.searchFiltered = true;
        // return to user
        return filteredProject;
    }

    // methods
    removeSearchFilter() {
        /*
        DESCRIPTION:    sets searchFiltered property to false

        INPUT:          NA

        RETURN:         NA
        */
        this.searchFiltered = false;
    }

    addSearchFilter() {
        /*
        DESCRIPTION:    sets searchFiltered property to true

        INPUT:          NA

        RETURN:         NA
        */
        this.searchFiltered = true;
    }

    addFilter(technology) {
        /*
        DESCRIPTION:    adds provided technology to filters array if applicable

        INPUT:          technology to be potentially added to filters array

        RETURN:         NA
        */
        if (!this.hasTechnology(technology.id)) {
            this.buttonFilters.push(technology);
        }
    }

    removeFilter(technology) {
        /*
        DESCRIPTION:    removes provided technology from filters array if
                        applicable

        INPUT:          technology to be potentially removed from filters array

        RETURN:         NA
        */
        if (!this.project.hasTechnology(technology.id)) {
            this.buttonFilters = this.buttonFilters.filter((element) => {
                return element.id !== technology.id
            });
        }
    }

    filtersIsEmpty() {
        /*
        DESCRIPTION:    indicates whether filters array is empty

        INPUT:          NA

        RETURN:         boolean indicating whether filters array is empty
        */
        return this.buttonFilters.length === 0;
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
        if (this.project.technologiesIsEmpty()) {
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
}


export { FilteredProject }