import { Request, Response } from "express"
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { USER } from "../../models/User/user.model";
import { deleteImageFromR2 } from "../../utils/s3.utils";

export const deleteProfilePicture = async (req: Request, res: Response) => {
        const lang = req.query.lang as Lang || 'en';
    try {
        const userId = res.locals.userId
        const deleteProfilePicture = await USER.findByIdAndUpdate(
            userId,
            { $unset: { photo: 1 } }, // Use $unset with field name and value 1
            { new: true } // Return the updated document
        )
        if (deleteProfilePicture) {
            const profileImagePath = `user/${userId}/profile-image`;
            await deleteImageFromR2(profileImagePath)
            return handleResponse(res, 200, success.profile_image_deleted , lang);
        }
        return handleResponse(res, 404, errors.profile_image_deleted, lang);
    } catch (error) {
        sendErrorToDiscord("DELETE:delete-profile", error)
        return handleResponse(res, 500, errors.catch_error, lang);
    }
}
