

class Technology {

    constructor(docSnapshot) {
        this.id = docSnapshot.id;
        this.name = docSnapshot.data().name;
        this.language = docSnapshot.data().language;
        this.backend = docSnapshot.data().backend;
    }

    
}


export { Technology }