import type { Request, Response, NextFunction } from "express";

// Simple in-memory token storage (in production, use Redis or database)
const validTokens = new Set<string>();

export function addValidToken(token: string) {
  validTokens.add(token);
}

export function removeValidToken(token: string) {
  validTokens.delete(token);
}

export function isValidToken(token: string): boolean {
  return validTokens.has(token);
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Authentifizierung erforderlich" });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  if (!isValidToken(token)) {
    return res.status(401).json({ message: "Ungültiger oder abgelaufener Token" });
  }
  
  next();
}
