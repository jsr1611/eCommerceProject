// user.model.ts

export interface User {
    _id?: string; // MongoDB ObjectId as a string
    username: string;
    email: string; // 
    password: string;
    firstname?: string,
    lastname?: string;
    is_activated?: boolean;
    is_superuser?: boolean;
    profilePicture?: string;
  }  

