export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
  expiresIn: '1d'
};
