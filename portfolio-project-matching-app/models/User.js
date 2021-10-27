class User {

    constructor(docSnapshot) {
        this.id = docSnapshot.id;
        this.email = docSnapshot.data().email;
        this.username = docSnapshot.data().username;
        this.introduction = docSnapshot.data().introduction;
        this.projects = null;
        this.technologies = null;
    }

    
}


export { User }