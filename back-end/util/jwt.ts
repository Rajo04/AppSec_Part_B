import jwt from 'jsonwebtoken';

const generateJWTToken = (email: string, role: string, id: number, firstName: string, lastName: string, phoneNumber: string): string => {
    const options = { expiresIn: `${process.env.JWT_EXPIRATION_TIME}h`, issuer: 'courses_app' };

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        return jwt.sign({ email, role, id, firstName, lastName, phoneNumber }, process.env.JWT_SECRET, options);
    } catch (error) {
        console.error(error);
        throw new Error('Error generating JWT token, see server log for details.');
    }
};

export { generateJWTToken };