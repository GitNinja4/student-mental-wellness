import express from "express";

import {
    register,
    login
} from "./auth_controller.js";

import {
    registerValidator,
    loginValidator
} from "./auth_validator.js";

import { validate } from "../../middleware/validation_middleware.js";

const router = express.Router();

router.post(
    "/register",
    registerValidator,
    validate,
    register
);

router.post(
    "/login",
    loginValidator,
    validate,
    login
);

export default router;