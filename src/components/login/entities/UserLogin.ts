export class UserLogin {
    email: string;
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

export interface IUser {
    
        id: number;
        user_name: string;
        access_token: string;
        name: string;
    
}