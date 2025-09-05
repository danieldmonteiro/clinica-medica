import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    // Verifica se começa com "Bearer "
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Formato do token inválido' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        (req as any).userId = decoded.id;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
};


// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// interface JwtPayload {
//     id: string;
// }

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) return res.status(401).json({ message: 'Acesso negado' });
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as
//   JwtPayload;
//       (req as any).userId = decoded.id;
//       next();
//     } catch (err) {
//       return res.status(400).json({ message: 'Token inválido' });
//     } 
// };