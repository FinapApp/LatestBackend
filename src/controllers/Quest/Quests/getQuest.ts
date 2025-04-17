import { Request, Response } from 'express'
import {  validateQuestId } from '../../../validators/validators'
import { errors, handleResponse } from '../../../utils/responseCodec'
import Joi from 'joi'
import { sendErrorToDiscord } from '../../../config/discord/errorDiscord'
import { QUESTS } from '../../../models/Quest/quest.model'

export const getQuest = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { questId } = req.params
        const questdetails = await QUESTS.findById(questId).populate('user', 'username photo')
        return handleResponse(res, 200, { questdetails })
    } catch (error) {
        sendErrorToDiscord("GET:get-comment", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}