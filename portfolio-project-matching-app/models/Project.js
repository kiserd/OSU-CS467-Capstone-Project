class Project {

    constructor(docSnapshot) {
        this.id = docSnapshot.id;
        this.name = docSnapshot.data().name;
        this.description = docSnapshot.data().description;
        this.capacity = docSnapshot.data().capacity;
        this.census = docSnapshot.data().census;
        this.open = docSnapshot.data().open;
        this.likes = docSnapshot.data().likes;
        this.ownerId = docSnapshot.data().owner.id;
        this.owner = null;
        this.technologies = null;
        this.users = null;
    }

    hasTechnology(technologyId) {
        // return false for null technologies property
        console.log('technologyId: ', technologyId)
        if (!this.technologies) {
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
