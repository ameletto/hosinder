export interface UserObj {
    email: string,
    name: string,
    image: string,
    grade: number,
    school?: string, // Object ID
    labels?: string[],
    previousEvents?: string[], // Object ID
    preferredEvents?: string[], // Object ID
    notWantedEvents?: string[], // Object ID
}

export interface EventObj {
    name: string; 
    description: string; 
    school: string; // Object ID
    labels?: string[]; // "individual" | "team" | ...
    image?: string; 
}

export interface SubmissionObj {
    user: string; 
    top3events: string[]; 
}

export interface SchoolObj {
    name: string; 
    admin: string[];  // Object ID
    description?: string; 
    image?: string;
}

export interface SchoolObjGraph extends SchoolObj {
    adminsArr: DatedObj<UserObj>[],
    eventsArr: DatedObj<EventObj>[],
}

export interface SessionObj {
    user: {
        name: string,
        email: string,
        image: string,
    },
    userId: string,
    username: string,
}

// generic / type alias from https://stackoverflow.com/questions/26652179/extending-interface-with-generic-in-typescript
export type DatedObj<T extends {}> = T & {
    _id: string,
    createdAt: string, // ISO date
    updatedAt: string, // ISO date
}

export type IdObj<T extends {}> = T & {
    _id: string,
}