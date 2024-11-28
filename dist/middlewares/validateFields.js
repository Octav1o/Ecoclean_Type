"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
/**
  Validate fields from a request
  and if there are errors, return a 400 status code
  otherwise, call the next middleware or controller
 */
const validateFields = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    return next();
};
exports.default = validateFields;
