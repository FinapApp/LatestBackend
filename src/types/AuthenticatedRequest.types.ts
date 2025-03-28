import { Request } from "express";
export interface AuthenticatedResponse extends Request {
  locals : {
    userId : string
  }
}
