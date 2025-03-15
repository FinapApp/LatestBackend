import { Request } from "express";
export interface AuthenticatedRequest extends Request {
  files?:
  | { [fieldname: string]: Express.Multer.File[] }
  | Express.Multer.File[];
  adminId?: string;
}
