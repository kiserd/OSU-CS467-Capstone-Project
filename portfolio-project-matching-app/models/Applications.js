import { Application } from './Application'
import { FilteredApplication } from './FilteredApplication'

class Applications {
    // fields
    visible;
    filtered;

    // static factory methods (used like overloaded constructors)
    static fromApplicationArray(apps) {
        /*
        DESCRIPTION:    takes array of Application objects and constructs
                        an Applications object

        INPUT:          applications (array): array of Application objects

        RETURN:         Applications object with visible set to provided
                        argument and filtered property set to an empty array
        */
        // instantiate new Applications object
        const applications = new Applications();
        // initialize visible to provided array and filtered to start empty
        applications.visible = apps;
        applications.filtered = [];
        // return to calling function
        return applications;
    }

    static fromExisting(apps) {
        /*
        DESCRIPTION:    takes an existing Applications object and essentially
                        copies fields in constructing this object

        INPUT:          apps (object): Applications object

        RETURN:         Applications object with visible set to provided
                        visible property and filtered property set to provided
                        filtered property
        */
        // instantiate new Applications object
        const applications = new Applications();
        // initialize visible to provided array and filtered to start empty
        applications.visible = apps.visible;
        applications.filtered = apps.filtered;
        // return to calling function
        return applications;
    }

    // methods
    addFilter(choice) {
        /*
        DESCRIPTION:    adds filter to and moves from visible to hidden array
                        for applicable projects

        INPUT:          choice (object): object representing filer being added

        RETURN:         NA
        */
        // handle case of open status filter
        if (choice.type === 'open') {
            // loop through filtered applications and potentially add filter
            // this.filtered.forEach(() => app.addOpenFilter(choice));
            for (const app of this.filtered) app.addOpenFilter(choice);
            // loop through visible incoming applications and process
            for (const app of this.visible) {
                if (app.isOpen() !== choice.open) {
                    // create FilteredApplication to add to hidden array
                    const temp = FilteredApplication.fromOpen(app, choice);
                    this.filtered.push(temp);
                    this.visible = this.visible.filter((elt) => {
                        return elt.id !== app.id;
                    })
                }
            }
        }
        // handle case of response filter
        if (choice.type === 'response') {
            // loop through hidden applications and potentially add filter
            for (const app of this.filtered) app.addResponseFilter(choice);
            // loop through visible incoming applications and process
            for (const app of this.visible) {
                if (!app.hasResponse(choice)) {
                    // create FilteredApplication to add to hidden array
                    const temp = FilteredApplication.fromResponse(app, choice);
                    this.filtered.push(temp);
                    this.visible = this.visible.filter((elt) => {
                        return elt.id !== app.id;
                    })
                }
            }
        }
    }

    removeFilter(choice) {
        /*
        DESCRIPTION:    removes filter and moves from hidden to visible array
                        for applicable projects

        INPUT:          choice (object): object representing filer being
                        removed

        RETURN:         NA
        */
        // loop through hidden incoming applications and process
        for (const app of this.filtered) {
            // remove filter if applicable
            if (choice.type === 'open') app.removeOpenFilter(choice);
            if (choice.type === 'response') app.removeResponseFilter(choice);
            // if last remaining filter removed, move project to visible
            if (app.filtersIsEmpty()) {
                this.visible.push(app.application);
                this.filtered = this.filtered.filter((elt) => {
                    return elt.application.id !== app.application.id;
                })
            }
        }
        // loop through hidden outgoing applications and process
        for (const app of this.filtered) {
            // remove filter if applicable
            if (choice.type === 'open') app.removeOpenFilter(choice);
            if (choice.type === 'response') app.removeResponseFilter(choice);
            // if last remaining filter removed, move project to visible
            if (app.filtersIsEmpty()) {
                this.visible.push(app.application);
                this.hidden = this.hidden.filter((elt) => {
                    return elt.application.id !== app.application.id;
                })
            }
        }
    }

}

export { Applications }