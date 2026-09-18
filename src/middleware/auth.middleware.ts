import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload & { userid: number };
        }
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({
            status: 500, success: false, data: null,
            message: "JWT_SECRET is not configured",
        });
    }

    let user: JwtPayload & { userid: number };
    try {
        const cookieName = process.env.JWT_COOKIE_NAME || "token";
        const cookie = (req.headers.cookie || "").split(";").find((part) => {
            const separator = part.indexOf("=");
            return separator >= 0 && part.slice(0, separator).trim() === cookieName;
        });

        const token = cookie !== undefined
            ? decodeURIComponent(cookie.slice(cookie.indexOf("=") + 1).trim())
            : /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || "")?.[1];

        if (!token) throw new Error("Missing token");
        const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
        if (typeof payload === "string") throw new Error("Invalid payload");
        const id = payload.userid ?? payload.userId ?? payload.id ?? payload.sub;
        if (typeof id !== "number" && (typeof id !== "string" || !/^\d+$/.test(id))) {
            throw new Error("Invalid user ID");
        }

        const userid = Number(id);
        if (!Number.isSafeInteger(userid) || userid <= 0) throw new Error("Invalid user ID");
        user = { ...payload, userid };
    } catch {
        return res.status(401).json({
            status: 401, success: false, data: null,
            message: "Unauthorized: token is missing, invalid, or expired",
        });
    }

    req.user = user;
    next();
}
