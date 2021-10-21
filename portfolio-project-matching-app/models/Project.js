

class Project {

    constructor(docSnapshot) {
        this.id = docSnapshot.id;
        this.name = docSnapshot.data().name;
        this.description = docSnapshot.data().description;
        this.capacity = docSnapshot.data().capacity;
        this.census = docSnapshot.data().cencus;
        this.open = docSnapshot.data().open;
        this.likes = docSnapshot.data().likes;
        this.ownerId = docSnapshot.data().owner.id;
        this.owner = null;
        this.technologies = [];
        this.users = [];
    }

    
}


export { Project }