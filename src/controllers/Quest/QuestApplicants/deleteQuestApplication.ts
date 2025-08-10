import { Request, Response } from "express"
import Joi from "joi";
import { validateQuestApplicantId } from "../../../validators/validators";
import { errors, handleResponse, Lang, success } from "../../../utils/responseCodec";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { QUESTS } from "../../../models/Quest/quest.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";

export const deleteQuestApplication = async (req: Request, res: Response) => {
        const lang = req.query.lang as Lang|| 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantId(req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const user = res.locals.userId;
        const check = await QUEST_APPLICANT.findOne({_id :req.params.questApplicantId , user}, "status")
        if (!check) return handleResponse(res, 404, errors.quest_applicant_not_found    , lang);
        if (check.status == "approved") {
            return handleResponse(res, 403, errors.unable_to_delete_quest_after_approval, lang);
        }
        const deleteQuestApplication = await QUEST_APPLICANT.findOneAndDelete({ _id: req.params.questApplicantId, user });
        if (deleteQuestApplication) {
            // if we delete the reel we need to delete the associated likes , comments on it as well , in case of notifing it we can do that as well.
            await QUESTS.findByIdAndUpdate(deleteQuestApplication.quest, {
                $inc: {
                    applicantCount: -1,
                    leftApproved: 1
                }
            })
            return handleResponse(res, 200, success.quest_deleted, lang)
        }
        return handleResponse(res, 404, errors.quest_deleted, lang)
    } catch (error) {
        console.error(error);
        sendErrorToDiscord("DELETE:delete-quest-application", error);
        return handleResponse(res, 500, errors.catch_error, lang)
    }
}
