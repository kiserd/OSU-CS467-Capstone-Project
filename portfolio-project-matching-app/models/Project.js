class Project {
    // fields
    id;
    name;
    description;
    capacity;
    census;
    open;
    likes;
    ownerId;
    owner;
    technologies;
    users;

    // static factory methods (used like overloaded constructors)
    static fromDocSnapshot(id, docSnapshot) {
        /*
        DESCRIPTION:    takes document ID and document snapshot and creates
                        corresponding Project object

        INPUT:          document ID in string format and project document
                        snapshot

        RETURN:         Project object with fields populated. Note,
                        associations like technologies and users will not be
                        populated.
        */
        // instantiate new Project object
        const project = new Project();
        // set fields/properties based on provided id and snapshot
        project.id = id;
        project.name = docSnapshot.data().name;
        project.description = docSnapshot.data().description;
        project.capacity = docSnapshot.data().capacity;
        project.census = docSnapshot.data().census;
        project.open = docSnapshot.data().open;
        project.likes = docSnapshot.data().likes;
        project.ownerId = docSnapshot.data().ownerId;
        project.owner = null;
        project.technologies = null;
        project.users = null;
        // return to user
        return project;
    }

    static fromObject(map) {
        /*
        DESCRIPTION:    takes map of project related data and creates a Project
                        object with similar fields

        INPUT:          map of project data with keys mirroring fields in
                        Firebase project documents

        RETURN:         Project object with fields populated. Note, any keys
                        that do not exist in the map will be left null in the
                        returned Project object
        */
        // instantiate new Project object
        const project = new Project();
        // set fields/properties based on provided id and snapshot
        if (map.id) project.id = map.id;
        if (map.name) project.name = map.name;
        if (map.description) project.description = map.description;
        if (map.capacity) project.capacity = map.capacity;
        if (map.census) project.census = map.census;
        if (map.open) project.open = map.open;
        if (map.likes) project.likes = map.likes;
        if (map.ownerId) project.ownerId = map.ownerId;
        if (map.owner) project.owner = map.owner;
        if (map.technologies) project.technologies = technologies;
        if (map.users) project.users = users;
        // return to user
        return project;
    }

    hasTechnology(technologyId) {
        /*
        DESCRIPTION:    indicates whether technology corresponding to provided
                        technologyId is associated with the project (this)

        INPUT:          technology document ID

        RETURN:         boolean indication as to whether there is an
                        association between the project and technology
        */
        // return false for null technologies property
        if (this.technologies == null || this.technologies.length === 0) {
            return false;
        }

        // loop through technologies in search of technologyId
        for (const technology of this.technologies) {
            if (technology.id === technologyId) {
                return true
            }
        }

        // search failed, return false
        return false
    }
    
}


export { Project }
