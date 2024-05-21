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

export interface AuthUser {
    data: {
        uid: string;
    };
}

export interface UpdatePassword {
    data: {
        uid: string;
        password: string;
    };
}

export interface AdminUser {
    data: {
        email: string;
    };
}

export interface GetUserTierAndLevel {
    data: {
        uid: string;
    };
}

export interface UpdateUserTierAndLevel {
    data: {
        uid: string;
        tier: string;
        level: number;
    };
}
