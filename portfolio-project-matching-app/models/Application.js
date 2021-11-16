class Application {
    // fields
    id;
    projectId;
    userId;
    ownerId;
    open;
    response;
    project;
    user;
    owner;

    // static factory methods (used like overloaded constructors)
    static fromDocSnapshot(id, docSnapshot) {
        /*
        DESCRIPTION:    takes document ID and document snapshot and creates
                        corresponding Application object

        INPUT:          document ID in string format and application document
                        snapshot

        RETURN:         Application object with fields populated. Note,
                        project, user, and owner properties will remain null
        */
        // instantiate new Project object
        const application = new Application();
        // set fields/properties based on provided id and snapshot
        application.id = id;
        application.projectId = docSnapshot.data().project_id;
        application.userId = docSnapshot.data().user_id;
        application.ownerId = docSnapshot.data().owner_id;
        application.open = docSnapshot.data().open;
        application.response = docSnapshot.data().response;
        // return to user
        return application;
    }

    // methods
    isOpen() {
        /*
        DESCRIPTION:    indicates whether Application object status property
                        matches status passed

        INPUT:          status (string): 

        RETURN:         boolean indicating whether status matches
        */
        return this.open;
    }

    hasResponse(response) {
        /*
        DESCRIPTION:    indicates whether Application object response property
                        matches response string passed

        INPUT:          response (string): 'Cancelled', 'Approved', 'Rejected',
                        or 'Pending'

        RETURN:         boolean indicating whether response matches
        */
        return this.response === response.name;
    }
}

export { Application }