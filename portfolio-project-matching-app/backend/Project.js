

class Project {
    // constructor() {
    //     this.id = null
    //     this.name = null
    //     this.description = null
    //     this.capacity = null
    //     this.census = null
    //     this.open = null
    //     this.likes = null
    //     this.ownerReference = null
    //     this.owner = null
    //     this.technologies = []
    //     this.users = []
    // }

    constructor(docSnapshot) {
        this.id = docSnapshot.id;
        this.name = docSnapshot.data().name;
        this.description = docSnapshot.data().description;
        this.capacity = docSnapshot.data().capacity;
        this.census = docSnapshot.data().cencus;
        this.open = docSnapshot.data().open;
        this.likes = docSnapshot.data().likes;
        this.ownerRef = docSnapshot.data().owner;
        this.owner = null;
        this.technologies = [];
        this.users = [];
    }

    
}


export { Project }