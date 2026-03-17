import type { Request, Response, NextFunction } from "express";
type JwtPayload = {
    sub: string;
    email: string;
    name: string;
};
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=authMiddleware.d.ts.map