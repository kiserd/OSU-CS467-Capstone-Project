class FilteredApplication {
    // fields
    application;
    openFilters;
    responseFilters;

    // static factory methods (used like overloaded constructors)
    static fromOpen(application, filter) {
        /*
        DESCRIPTION:    constructs a FilteredApplication object from an
                        Application object and a status filter being applied to
                        said Application

        INPUT:          application (Application object): Application being 
                        filtered

                        filter (filter object): status filter being
                        applied to Application object

        RETURN:         FilteredApplication object with application property 
                        set and status filter added to statusFilters array
                        property
        */
        // instantiate new FilteredApplication object
        const filteredApplication = new FilteredApplication();
        // set fields/properties based on provided id and snapshot
        filteredApplication.application = application;
        filteredApplication.openFilters = [filter];
        filteredApplication.responseFilters = [];
        // return to user
        return filteredApplication;
    }

    static fromResponse(application, filter) {
        /*
        DESCRIPTION:    constructs a FilteredApplication object from an
                        Application object and a response filter being applied
                        to said Application

        INPUT:          application (Application object): Application being 
                        filtered

                        filter (filter object): response filter being
                        applied to Application object

        RETURN:         FilteredApplication object with application property 
                        set and response filter added to responseFilters array
                        property
        */
        // instantiate new FilteredApplication object
        const filteredApplication = new FilteredApplication();
        // set fields/properties based on provided id and snapshot
        filteredApplication.application = application;
        filteredApplication.openFilters = [];
        filteredApplication.responseFilters = [filter];
        // return to user
        return filteredApplication;
    }

    // methods
    addOpenFilter(filter) {
        /*
        DESCRIPTION:    adds provided open status to filters array if
                        applicable

        INPUT:          filter (object): object containing open status

        RETURN:         NA
        */
        if (!filter.open && this.application.isOpen()) {
            this.openFilters.push(filter);
        }
        else if (filter.open && !this.application.isOpen()) {
            this.openFilters.push(filter);
        }
    }

    removeOpenFilter(filter) {
        /*
        DESCRIPTION:    removes provided open status from filters array if
                        applicable

        INPUT:          filter (object): object containing open status

        RETURN:         NA
        */
        if (!filter.open && this.application.isOpen()) {
            this.openFilters = this.openFilters.filter((element) => {
                return element.id !== filter.id
            });
        }
        else if (filter.open && !this.application.isOpen()) {
            this.openFilters = this.openFilters.filter((element) => {
                return element.id !== filter.id
            });
        }
    }

    addResponseFilter(response) {
        /*
        DESCRIPTION:    adds provided response to filters array if applicable

        INPUT:          response (object): object containing response filter id
                        and name

        RETURN:         NA
        */
        if (!this.application.hasResponse(response)) {
            this.responseFilters.push(response);
        }
    }

    removeResponseFilter(response) {
        /*
        DESCRIPTION:    removes provided response from filters array if
                        applicable

        INPUT:          response (object): response to be potentially removed
                        from filters array

        RETURN:         NA
        */
        if (!this.application.hasResponse(response)) {
            this.responseFilters = this.responseFilters.filter((element) => {
                return element.id !== response.id;
            });
        }
    }

    filtersIsEmpty() {
        /*
        DESCRIPTION:    indicates whether both filters arrays are empty

        INPUT:          NA

        RETURN:         boolean indicating whether filters arrays are empty
        */
        return this.responseFilters.length === 0 && this.openFilters.length === 0;
    }
}


export { FilteredApplication }