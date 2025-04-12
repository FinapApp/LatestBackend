import { Request, Response } from "express";
import { errors, handleResponse } from "../../../utils/responseCodec";
import Joi from "joi";
import {validateCreatePayments } from "../../../validators/validators";
import { stripe } from "../../../config/stripe/stripe.config";
import { USER } from "../../../models/User/user.model";

export const createAndRetriveCustomer = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreatePayments(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const searchEmail = await USER.findById(res.locals.userId, "email")
        if (searchEmail) {
            const customer = await stripe.customers.list(
                {
                    email: searchEmail?.email,
                    limit: 1,
                },
                {
                    stripeAccount: req.body.stripeAccountId,
                }
            );
            if (customer.data[0]?.id) {
                return customer.data[0];
            } else {
                const {email , phoneNumber , stripeAccountId} = req.body;
                const newCustomer = await stripe.customers.create(
                    { email, phone: phoneNumber ?? undefined },
                    {
                        stripeAccount: stripeAccountId,
                    }
                );
                return newCustomer;
            }
        }
    } catch (error: any) {
        if (error.code == 11000) {
            return handleResponse(res, 500, errors.cannot_rerunIt)
        }
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
