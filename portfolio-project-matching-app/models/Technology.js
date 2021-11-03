

class Technology {

    constructor(id, docSnapshot) {
        this.id = id;
        this.name = docSnapshot.data().name;
        this.language = docSnapshot.data().language;
        this.backend = docSnapshot.data().backend;
    }

    
}


export { Technology }