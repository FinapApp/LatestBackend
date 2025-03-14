import { Request, Response } from 'express'
import {  validateGetAllFlicks } from '../../validators/validators';
import Joi from 'joi';
import { errors, handleResponse } from '../../utils/responseCodec';
import { getAllFlicksAggregation } from '../../aggregation/getAllFlicksAggregation';

export const getAllFlicks = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetAllFlicks(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId
        console.log(user)
        let response = await getAllFlicksAggregation(user, req.query.params as string)
        if(!response){
            return handleResponse(res, 304, errors.no_flicks)
        }
        return handleResponse(res, 200, { response })
    } catch (error) {
        console.log(error)
        return handleResponse(res, 500, errors.catch_error)
    }
}