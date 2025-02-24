import Joi, { optional } from "joi";
import countries from "../constants/countryList";
import { config } from "../config/generalconfig";

export const validateLogin = (body: object) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    fcmToken: Joi.string().required()
  });
  const { error } = schema.validate(body);
  return error;
};


export const validateForgetPassword = (body: object) => {
  const schema = Joi.object({
    identifier: Joi.string().required()
  })
  const { error } = schema.validate(body);
  return error;
}


export const validateOTPAfterForgetPassword = (body: object) => {
  const schema = Joi.object({
    otp: Joi.string().required(),
    identifier: Joi.string().required(),
    password: Joi.string().required()
  }).xor('email', 'username', 'phone');
  const { error } = schema.validate(body);
  return error;
}

export const validateAfterSignUp = (body: object) => {
  const schema = Joi.object({
    otp: Joi.string().required(),
    email: Joi.string().required(),
    fcmToken: Joi.string().required()
  });
  const { error } = schema.validate(body);
  return error;
}


export const validateSignUp = (body: object) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
  });
  const { error } = schema.validate(body);
  return error;
}

export const validateVerifyOTPSignUp = (body: object) => {
  const schema = Joi.object({
    fcmToken: Joi.string().required(),
    otp: Joi.string().required(),
    email: Joi.string().required(),
    name: Joi.string().required(),
    dob: Joi.string().required(),
    country: Joi.string().required().custom((value, helpers) => {
      // Check if country exists in your predefined countries list
      if (!countries.some(e => e.code === value)) {
        return helpers.error("any.invalid", { message: "Country is not valid" });
      }
      return value;
    }),
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error } = schema.validate(body);
  return error;
}

export const validateUpdateComment = (body: object, params: object) => {
  const bodySchema = Joi.object({
    comment: Joi.array().items(Joi.object({
      type: Joi.string().valid("user", "text"),
      mention: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      text: Joi.string(),
    })),
  })
  const paramSchema = Joi.object({
    commentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id'),
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}


export const validateUpdateReplyComment = (body: object, params: object) => {
  const bodySchema = Joi.object({
    comment: Joi.array().items(Joi.object({
      type: Joi.string().valid("user", "text"),
      mention: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      text: Joi.string(),
    })),
  })
  const paramSchema = Joi.object({
    commentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id'),
    flickId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id'),
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}

export const validateComment = (body: object, params: object) => {
  const bodySchema = Joi.object({
    comment: Joi.array().items(Joi.object({
      type: Joi.string().valid("user", "text"),
      mention: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      text: Joi.string(),
    })),
  })
  const paramSchema = Joi.object({
    flickId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}


export const validateCommentId = (params: object) => {
  const schema = Joi.object({
    commentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const { error } = schema.validate(params)
  return error
}


export const validatePresignedFlick = (body: object) => {
  const schema = Joi.object({
    videoName : Joi.string(),
    thumbnailName: Joi.string(),
    audioName: Joi.string().optional(),
    photosName: Joi.array().items(Joi.string())
  })
  const { error } = schema.validate(body)
  return error
}


export const validateCreateFlick = (body: object, params: object) => {
  const paramsSchema = Joi.object({
    flickId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const bodySchema = Joi.object({
    song: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
    audio: Joi.string().optional(),
    audioName: Joi.string().optional(),
    videoURL: Joi.string().optional(),
    photos: Joi.array().items(Joi.string()).optional(),
    thumbnailURL: Joi.string().optional(),
    duration: Joi.number().optional(),
    hashTags: Joi.array().items(Joi.string()).optional(),
    description: Joi.array().items(Joi.object({
      type: Joi.string().valid("user", "text"),
      mention: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      text: Joi.string()
    })).optional(),
    songStart: Joi.number().optional(),
    songEnd: Joi.number().optional(),
  }).xor('videoURL', 'photoPaths')
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}


export const validateFlickId = (params: object) => {
  const schema = Joi.object({
    flickId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const { error } = schema.validate(params)
  return error
}
export const validateReportUser = (body: object, params: object) => {
  const paramsSchema = Joi.object({
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
  })
  const bodySchema = Joi.object({
    message: Joi.string().required()
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}


export const validateReportComment = (body: object, params: object) => {
  const paramsSchema = Joi.object({
    commentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
  })
  const bodySchema = Joi.object({
    message: Joi.string().required()
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}

export const validateReportFlick = (body: object, params: object) => {
  const paramsSchema = Joi.object({
    flickId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
  })
  const bodySchema = Joi.object({
    message: Joi.string().required()
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}




export const validateShareFlick = (body: object) => {
  const schema = Joi.object({
    flickId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
  })
  const { error } = schema.validate(body)
  return error
}



export const validatePresignedSong = (body: object) => {
  const schema = Joi.object({
    fileName: Joi.string()
  })
  const { error } = schema.validate(body)
  return error
}


export const validateCreateSong = (body: object, params: object) => {
  const paramsSchema = Joi.object({
    songId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const bodySchema = Joi.object({
    name: Joi.string().required(),
    url: Joi.string().required(),
    duration: Joi.number().required(),
    icon: Joi.string().required(),
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}


export const validateCreateFeedback = (body: object) => {
  const schema = Joi.object({
    message: Joi.string().required(),
    rating: Joi.string().required()
  })
  const { error } = schema.validate(body)
  return error
}


export const validateCreateFollower = (params: object) => {
  const schema = Joi.object({
    followerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const { error } = schema.validate(params)
  return error
}


export const getQueryParams = (query: object) => {
  const schema = Joi.object({
    skip: Joi.string().optional(),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
  })
  const { error } = schema.validate(query)
  return error
}


// export const validateCreateQuest = (body: object) => {



export const validateUpdateFlick = (body: object, params: object) => {
  const bodySchema = Joi.object({
    description: Joi.array().items(Joi.object({
      type: Joi.string().valid("user", "text"),
      mention: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      text: Joi.string()
    })).optional(),
    hashTags: Joi.array().items(Joi.string()).optional(),
    songStart: Joi.number().optional(),
    songEnd: Joi.number().optional(),
    location: Joi.string().optional(),
    collabs: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id')).optional(),
  })
  const paramsSchema = Joi.object({
    flickId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}

export const validateNotificationQuery = (query: object) => {
  const schema = Joi.object({
    skip: Joi.string().optional()
  })
  const { error } = schema.validate(query)
  return error
}


export const validateStoryUpload = (body: object) => {
  const schema = Joi.object({
    mediaURL: Joi.string().required(),
    thumbnailURL: Joi.string().required(),
  })
  const { error } = schema.validate(body)
  return error
}



export const validateCreateStory = (body: string, params: object) => {
  const paramSchema = Joi.object({
    storyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const bodySchema = Joi.object({
    mediaType: Joi.string().valid("photo", "video").required(),
    song: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
    mediaURL: Joi.string().required(),
    thumbnailURL: Joi.string().required(),
    songStart: Joi.number().optional(),
    songEnd: Joi.number().optional(),
    hashTags: Joi.array().items(Joi.string()).optional(),
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}



export const validateStoryId = (params: object) => {
  const schema = Joi.object({
    storyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const { error } = schema.validate(params)
  return error
}


export const validateAddStoryViewer = (body: object, params: object) => {
  const bodySchema = Joi.object({
    reaction: Joi.string().required()
  })
  const paramSchema = Joi.object({
    storyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}

export const validatePresignedQuest = (body: object) => {
  const schema = Joi.object({
    media: Joi.array().items(Joi.string()).required(),
  })
  const { error } = schema.validate(body)
  return error
}



export const validateCreateQuest = (body: object, params: object) => {
  const bodySchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    media: Joi.array().items(Joi.string().pattern(new RegExp(`^${config.R2.R2_PUBLIC_URL}/.+$`)).required()).required().message("media must be a valid URL"),
    mode: Joi.string().valid("GoFlick", "OnFlick").required(),
    location: Joi.string().required(),
    coords: Joi.object({
      lat: Joi.number().required(),
      long: Joi.number().required()
    }),
    maxApplicants: Joi.number().required(),
    totalAmount: Joi.number().required(),
  })
  const paramsSchema = Joi.object({
    questId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}

export const validateCreateQuestApplication = (body: object, params: object) => {
  const paramsSchema = Joi.object({
    questApplicantId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const bodySchema = Joi.object({
    quest: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
    description: Joi.string().required(),
    media: Joi.array().items(Joi.object({
      mediaURL: Joi.string().required(),
      thumbnailURL: Joi.string().required(),
      type: Joi.string().valid('photo', 'video', 'audio', 'pdf').required()
    })).required(),
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}

export const validatePresignedQuestApplication = (body: object) => {
  const schema = Joi.object({
    media: Joi.array().items(Joi.object({
      mediaURL: Joi.string().required(),
      thumbnailURL: Joi.string().required(),
    })).required(),
  })
  const { error } = schema.validate(body)
  return error
}



export const validateQuestId = (params: object) => {
  const schema = Joi.object({
    questId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const { error } = schema.validate(params)
  return error
}





export const validateGetAllFlicks = (query: object) => {
  const schema = Joi.object({
    skip: Joi.string().optional(),
  })
  const { error } = schema.validate(query)
  return error
}


export const validateGetAllComments = (query: object) => {
  const schema = Joi.object({
    skip: Joi.string().optional()
  })
  const { error } = schema.validate(query)
  return error
}





export const validateSongUpload = (body: object, params: object) => {
  const paramsSchema = Joi.object({
    songId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const bodySchema = Joi.object({
    fileName: Joi.string().required()
  })
  const combinedSchema = Joi.object({
    params: paramsSchema,
    body: bodySchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}


export const validateSignedURLFlicks = (body: object) => {
  const schema = Joi.object({
    videoURL: Joi.string().optional(),
    photos: Joi.array().items(Joi.string()).optional(),
    song: Joi.string().optional(),
  }).xor('videoURL', 'photos')
  const { error } = schema.validate(body)
  return error
}



export const validateQuestApplicantId = (params: object) => {
  const schema = Joi.object({
    questApplicantId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const { error } = schema.validate(params)
  return error
}


export const validateCreateQuestApplicant = (body: object, params: object) => {
  const bodySchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    media: Joi.array().items(Joi.string()).optional(),
  })
  const paramsSchema = Joi.object({
    questId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}

export const validateLike = (body: object) => {
  const schema = Joi.object({
    flick: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
    comment: Joi.string().regex(/^ [0 - 9a - fA - F]{ 24}$ /, 'object Id').optional(),
    value: Joi.boolean()
  }).xor("flick", "comment")
  const { error } = schema.validate(body)
  return error
}


export const validateFeedbackId = (params: object) => {
  const schema = Joi.object({
    feedbackId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const { error } = schema.validate(params)
  return error
}


export const validateUpdateFeedback = (body: object, params: object) => {
  const bodySchema = Joi.object({
    message: Joi.string().optional(),
    rating: Joi.string().optional(),
    status: Joi.string().valid("pending", "resolved").optional()
  })
  const paramsSchema = Joi.object({
    feedbackId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}
