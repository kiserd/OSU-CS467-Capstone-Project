import { Project } from './Project'
import { FilteredProject } from './FilteredProject'

class Projects {
    // fields
    visible;
    filtered;

    // static factory methods (used like overloaded constructors)
    static fromProjectArray(proj) {
        /*
        DESCRIPTION:    takes array of Project objects and constructs
                        an Projects object

        INPUT:          proj (array): array of Project objects

        RETURN:         Projects object with visible set to provided
                        argument and filtered property set to an empty array
        */
        // instantiate new Applications object
        const projects = new Projects();
        // initialize visible to provided array and filtered to start empty
        projects.visible = proj;
        projects.filtered = [];
        // return to calling function
        return projects;
    }

    static fromExisting(proj) {
        /*
        DESCRIPTION:    takes an existing Projects object and essentially
                        copies fields in constructing this object

        INPUT:          projects (object): Projects object

        RETURN:         Projects object with visible set to provided
                        visible property and filtered property set to provided
                        filtered property
        */
        // instantiate new Applications object
        const projects = new Projects();
        // initialize visible to provided array and filtered to start empty
        projects.visible = proj.visible;
        projects.filtered = proj.filtered;
        // return to calling function
        return projects;
    }

    // methods
    addFilter = (choice) => {
        /*
        DESCRIPTION:    moves projects lacking the provided technology from
                        visible to hidden and converts them from Project
                        objects to FilteredProject objects

        INPUT:          Technology object representing filter being added

        RETURN:         NA
        */
        // loop through filtered projects and potentially add additional filter
        for (const project of this.filtered) project.addFilter(choice);

        // loop through visible projects and determine whether they need hidden
        for (const project of this.visible) {
            if (!project.hasTechnology(choice.id)) {
                // create FilteredProject to add to hiddenProjects list
                const temp = FilteredProject.fromButton(project, choice);
                this.filtered.push(temp);
                this.visible = this.visible.filter((elt) => {
                    return elt.id !== project.id;
                });
            }
        }
    }

    removeFilter = (choice) => {
        /*
        DESCRIPTION:    moves projects lacking the provided technology from
                        hidden to visible and converts them from
                        FilteredProject objects to Project objects

        INPUT:          Technology object representing filter being removed

        RETURN:         NA
        */
        // loop through hidden projects to see if they need moved to visible
        for (const project of this.filtered) {
            // remove filter if applicable
            project.removeFilter(choice);
            // if last remaining filter removed, move project to visible
            if (project.filtersIsEmpty() && !project.searchFiltered) {
                this.visible.push(project.project);
                this.filtered = this.filtered.filter((elt) => {
                    return elt.project.id !== project.project.id;
                });
            }
        }
    }

    onSearch = (key) => {
        /*
        DESCRIPTION:    

        INPUT:          

        RETURN:         NA
        */
        // loop through hidden projects and potentially add search filter
        for (const project of this.filtered) {
            if (!project.project.hasSearchKey(key)) {
                project.addSearchFilter();
            }
        }
        // loop through visible projects and potentially hide
        for (const project of this.visible) {
            if (!project.hasSearchKey(key)) {
                // create HiddenProject object to add to hiddenProjects
                this.filtered.push(FilteredProject.fromSearch(project, key));
                this.visible = this.visible.filter((elt) => {
                    return elt.id !== project.id;
                });
            }
        }
    }

    clearSearch = () => {
        /*
        DESCRIPTION:    

        INPUT:          

        RETURN:         NA
        */
        // loop through hidden projects and process elements
        for (const project of this.filtered) {
            // remove search filter
            project.removeSearchFilter();
            // if last remaining filter removed, move from hidden to visible
            if (project.filtersIsEmpty() && !project.searchFiltered) {
                this.visible.push(project.project);
                this.filtered = this.filtered.filter((elt) => {
                    return elt.project.id !== project.project.id;
                });
            }
        }
    }

}

export { Projects }