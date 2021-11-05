class Technology {
    // fields
    id;
    name;
    language;
    backend;

    // static factory methods (used like overloaded constructors)
    static fromDocSnapshot(id, docSnapshot) {
        /*
        DESCRIPTION:    takes document ID and document snapshot and creates
                        corresponding Technology object

        INPUT:          document ID in string format and technology document
                        snapshot

        RETURN:         Technology object with fields populated.
        */
        // instantiate new Technology object
        const technology = new Technology();
        // set fields/properties based on provided id and snapshot
        technology.id = id;
        technology.name = docSnapshot.data().name;
        technology.language = docSnapshot.data().language;
        technology.backend = docSnapshot.data().backend;
        // return to user
        return technology;
    }

    static fromObject(map) {
        /*
        DESCRIPTION:    takes map of technology related data and creates a
                        Technology object with similar fields

        INPUT:          map of technology data with keys mirroring fields in
                        Firebase technology documents

        RETURN:         Technology object with fields populated. Note, any keys
                        that do not exist in the map will be left null in the
                        returned Technology object
        */
        // instantiate new Technology object
        const technology = new Technology();
        // set fields/properties based on provided id and snapshot
        if (map.id) technology.id = map.id;
        if (map.name) technology.name = map.name;
        if (map.description) technology.language = map.language;
        if (map.capacity) technology.backend = map.backend;
        // return to user
        return technology;
    }

    // constructor(id, docSnapshot) {
    //     this.id = id;
    //     this.name = docSnapshot.data().name;
    //     this.language = docSnapshot.data().language;
    //     this.backend = docSnapshot.data().backend;
    // }

    
}


export { Technology }