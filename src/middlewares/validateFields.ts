import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
/**
  Validate fields from a request
  and if there are errors, return a 400 status code
  otherwise, call the next middleware or controller 
 */

const validateFields = (
  req: Request,
  res: Response,
  next: Function
): Response | NextFunction => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  return next();
};
export default validateFields;