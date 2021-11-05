class User {
    // fields
    id;
    email;
    username;
    introduction;
    projects;
    technologies;

    // static factory methods (used like overloaded constructors)
    static fromDocSnapshot(id, docSnapshot) {
        /*
        DESCRIPTION:    takes document ID and document snapshot and creates
                        corresponding User object

        INPUT:          document ID in string format and user document snapshot

        RETURN:         User object with fields populated.
        */
        // instantiate new User object
        const user = new User();
        // set fields/properties based on provided id and snapshot
        user.id = id;
        user.email = docSnapshot.data().email;
        user.username = docSnapshot.data().username;
        user.introduction = docSnapshot.data().introduction;
        user.projects = null;
        user.technologies = null;
        // return to user
        return user;
    }

    static fromObject(map) {
        /*
        DESCRIPTION:    takes map of user related data and creates a user
                        object with similar fields

        INPUT:          map of user data with keys mirroring fields in
                        Firebase user documents

        RETURN:         User object with fields populated. Note, any keys
                        that do not exist in the map will be left null in the
                        returned User object
        */
        // instantiate new User object
        const user = new User();
        // set fields/properties based on provided id and snapshot
        if (map.id) user.id = map.id;
        if (map.email) user.email = map.email;
        if (map.username) user.username = map.username;
        if (map.introduction) user.introduction = map.introduction;
        if (map.projects) user.projects = map.projects;
        if (map.technologies) user.technologies = map.technologies;
        // return to user
        return user;
    }

    hasTechnology(technologyId) {
        /*
        DESCRIPTION:    indicates whether technology corresponding to provided
                        technologyId is associated with the user (this)

        INPUT:          technology document ID

        RETURN:         boolean indication as to whether there is an
                        association between the user and technology
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


export { User }