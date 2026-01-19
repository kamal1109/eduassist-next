// Utility functions untuk validasi input Auth

export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) errors.push("Minimal 8 karakter");
    if (!/[A-Z]/.test(password)) errors.push("Minimal 1 huruf besar");
    if (!/[a-z]/.test(password)) errors.push("Minimal 1 huruf kecil");
    if (!/\d/.test(password)) errors.push("Minimal 1 angka");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Minimal 1 simbol");

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const generateSessionToken = (): string => {
    // Generate random string untuk session ID manual (jika diperlukan)
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};