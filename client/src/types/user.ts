export type User = {
    id: string;
    displayName: string;
    email: string;
    imageUrl?: string;
    token: string;
}

export type LoginCredentials = {
    email: string;
    password: string;   
}

export type RegisterCredentials = {
    email: string;
    displayName: string;
    password: string;
}