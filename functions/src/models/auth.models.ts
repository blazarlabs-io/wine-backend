export interface NewUser {
    data: {
        email: string;
        password: string;
        tier: string;
        level: number;
    };
}

export interface DeleteUser {
    data: {
        uid: string;
    };
}

export interface AdminUser {
    data: {
        email: string;
    };
}
