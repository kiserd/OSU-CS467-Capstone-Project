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

    // static fromObject(map) {
    //     /*
    //     DESCRIPTION:    takes map of project related data and creates a Project
    //                     object with similar fields

    //     INPUT:          map of project data with keys mirroring fields in
    //                     Firebase project documents

    //     RETURN:         Project object with fields populated. Note, any keys
    //                     that do not exist in the map will be left null in the
    //                     returned Project object
    //     */
    //     // instantiate new Project object
    //     const project = new Project();
    //     // set fields/properties based on provided id and snapshot
    //     if (map.id) project.id = map.id;
    //     if (map.name) project.name = map.name;
    //     // return to user
    //     return project;
    // }
}

export { Application }