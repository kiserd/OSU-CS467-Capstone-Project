class Project {

    constructor(id, docSnapshot) {
        this.id = id;
        this.name = docSnapshot.data().name;
        this.description = docSnapshot.data().description;
        this.capacity = docSnapshot.data().capacity;
        this.census = docSnapshot.data().census;
        this.open = docSnapshot.data().open;
        this.likes = docSnapshot.data().likes;
        this.ownerId = docSnapshot.data().ownerId;
        this.owner = null;
        this.technologies = null;
        this.users = null;
    }

    // constructor(id, name, description, capacity, census, open, likes, ownerId) {
    //     this.id = id;
    //     this.name = name;
    //     this.description = description;
    //     this.capacity = capacity;
    //     this.census = census;
    //     this.open = open;
    //     this.likes = likes;
    //     this.ownerId = ownerId;
    //     this.owner = null;
    //     this.technologies = null;
    //     this.users = null;
    // }

    hasTechnology(technologyId) {
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
