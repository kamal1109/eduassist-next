export interface SessionData {
    userId: string;
    email: string;
    role: string;
    expiry: number;
}

export interface RateLimitData {
    count: number;
    resetTime: number;
}