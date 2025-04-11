import Joi from "joi";
import countries from "../constants/countryList";
import { config } from "../config/generalconfig";
import { REGEX } from "../utils/regex";

export const validateLogin = (body: object) => {
  const schema = Joi.object({
    email: Joi.string().email().optional(),
    username: Joi.string().optional()
      .min(4)
      .max(30)
      .regex(REGEX.USERNAME)
      .messages({
        "string.pattern.base": "Invalid username format",
      }),
    phone: Joi.string()
      .optional()
      .pattern(REGEX.PHONE)
      .messages({
        'string.pattern.base': 'Phone number must be a valid international format',
      }),
    password: Joi.string().required(),
    fcmToken: Joi.string().required()
  }).xor("email", "username", "phone");
  const { error } = schema.validate(body);
  return error;
};
export const validateGetters = (query: object) => {
  const schema = Joi.object({
    search: Joi.string().optional(),
    skip: Joi.string().optional(),
    sort: Joi.string().optional(),
    order: Joi.string().valid('asc', 'desc').optional()
  })
  const { error } = schema.validate(query)
  return error
}
export const validateForgetPassword = (body: object) => {
  const schema = Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string()
      .optional()
      .pattern(REGEX.PHONE)
      .messages({
        'string.pattern.base': 'Phone number must be a valid international format',
      }),
    username: Joi.string().optional()
      .min(4)
      .max(30)
      .regex(REGEX.USERNAME)
      .messages({
        "string.pattern.base": "Invalid username format",
      }),
  }).xor('email', 'username', 'phone');
  const { error } = schema.validate(body);
  return error;
}
export const validateOTPForgetPassword = (body: object) => {
  const schema = Joi.object({
    otp: Joi.string().required(),
    email: Joi.string().email().optional(),
    phone: Joi.string()
      .optional()
      .pattern(REGEX.PHONE)
      .messages({
        'string.pattern.base': 'Phone number must be a valid international format',
      }),
    username: Joi.string().optional()
      .min(4)
      .max(30)
      .regex(REGEX.USERNAME)
      .messages({
        "string.pattern.base": "Invalid username format",
      }),
  }).xor('email', 'username', 'phone');
  const { error } = schema.validate(body);
  return error;
}


export const validateUpdatePasswordAfterOTP = (body: object) => {
  const schema = Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string()
      .optional()
      .pattern(REGEX.PHONE)
      .messages({
        'string.pattern.base': 'Phone number must be a valid international format',
      }),
    username: Joi.string().optional()
      .min(4)
      .max(30)
      .regex(REGEX.USERNAME)
      .messages({
        "string.pattern.base": "Invalid username format",
      }),
    password: Joi.string().required(),
  })
  const { error } = schema.validate(body)
  return error
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
    dob: Joi.string().isoDate().required(),
    country: Joi.string().required().custom((value, helpers) => {
      // Check if country exists in your predefined countries list
      if (!countries.some(e => e.code === value)) {
        return helpers.error("any.invalid", { message: "Country is not valid" });
      }
      return value;
    }),
    username: Joi.string().required()
      .min(4)
      .max(30)
      .regex(REGEX.USERNAME)
      .messages({
        "string.pattern.base": "Invalid username format",
      }),
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
    }).xor("mention", "text")).required().messages({
      'array.xor': 'Either mention or text is required'
    }),
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
    mediaFiles: Joi.array().items(Joi.object({
      fileType: Joi.string().required(),
      fileName: Joi.string().required()
    })).required(),
    audioName: Joi.string().optional(),
    audioFileType: Joi.string().optional()
  })
  const { error } = schema.validate(body)
  return error
}

export const validateCreateFlick = (body: object, params: object) => {
  const paramsSchema = Joi.object({
    flickId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const bodySchema = Joi.object({
    media: Joi.array().items(Joi.object({
      type: Joi.string().valid("photo", "video").required(),
      duration: Joi.number().optional(),
      audio: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      alt: Joi.string().required(),
      taggedUsers: Joi.array().items(Joi.object({
        user: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
        position: Joi.object({
          x: Joi.number().required(),
          y: Joi.number().required()
        }).required()
      })).optional(),
      url: Joi.string().required()
    }).min(1).max(14)).required().messages({
      'array.min': 'At least one media item is required',
      'array.max': 'A maximum of 14 media items are allowed'
    }),
    song: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
    songStart: Joi.number().optional(),
    songEnd: Joi.number().optional(),
    thumbnailURL: Joi.string().required(),
    description: Joi.array().items(Joi.object({
      mention: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      hashTag: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      text: Joi.string().when(Joi.object({ mention: Joi.exist() }).unknown(), {
        then: Joi.required(),
        otherwise: Joi.when(Joi.object({ hashTag: Joi.exist() }).unknown(), {
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    })).optional(),
    location: Joi.string().optional(),
    collabs: Joi.array().items(Joi.object({
      user: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
      position: Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required()
      }).required()
    })).optional(),
    newHashTag: Joi.array().items(Joi.object({
      id : Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
      value: Joi.string().required()
    })).optional(),
    commentVisible: Joi.boolean().optional(),
    likeVisible: Joi.boolean().optional(),
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}


export const validateGetHashtags = (query: object) => {
  const schema = Joi.object({
    search: Joi.string().required()
  })
  const { error } = schema.validate(query)
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
    attachment: Joi.array().items(Joi.string().required()).optional(),
    message: Joi.string().required()
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}

export const validateReportStory = (body: object, params: object) => {
  const paramsSchema = Joi.object({
    storyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
  })
  const bodySchema = Joi.object({
    attachment: Joi.array().items(Joi.string().required()).optional(),
    message: Joi.string().required()
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}

export const validateReportAudio = (body: object, params: object) => {
  const paramsSchema = Joi.object({
    audioId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
  })
  const bodySchema = Joi.object({
    attachment: Joi.array().items(Joi.string().required()).optional(),
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
    attachment: Joi.array().items(Joi.string().required()).optional(),
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
    attachment: Joi.array().items(Joi.string().required()).optional(),
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

export const validatePresignedProfile = (body: object) => {
  const schema = Joi.object({
    fileType: Joi.string()
  })
  const { error } = schema.validate(body)
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

export const validateUpdateTheme = (body: object) => {
  const schema = Joi.object({
    theme: Joi.string().valid("light", "dark", "system").required()
  })
  const { error } = schema.validate(body)
  return error
}


export const validateUpdateTwoFactor = (body: object) => {
  const schema = Joi.object({
    twoFactor: Joi.boolean().optional(),
    twoFactorMethod: Joi.string().valid("sms", "email").optional()
  })
  const { error } = schema.validate(body)
  return error
}


export const validateCreateBioLink = (body: object) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    url: Joi.string().required()
  })
  const { error } = schema.validate(body)
  return error
}
export const validateUpdateBioLink = (body: object, params: object) => {
  const bodySchema = Joi.object({
    title: Joi.string().required(),
    url: Joi.string().required()
  })
  const paramsSchema = Joi.object({
    bioLinkId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional()
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    params: paramsSchema
  })
  const { error } = combinedSchema.validate({ body, params })
  return error
}


export const validateBioLinkId = (params: object) => {
  const schema = Joi.object({
    bioLinkId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const { error } = schema.validate(params)
  return error
}

export const validateGetProfileDetail = (query : object) => {
  const schema = Joi.object({
    // userId   : Joi.alternatives().try(
    //   Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
    // ),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id'),
  })
  const { error } = schema.validate(query)
  return error
}


export const validateUpdateFlick = (body: object, params: object) => {
  const bodySchema = Joi.object({
    media: Joi.array().items(Joi.object({
      type: Joi.string().valid("photo", "video").optional(),
      duration: Joi.number().optional(),
      audio: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      alt: Joi.string().optional(),
      taggedUsers: Joi.array().items(Joi.object({
        user: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
        position: Joi.object({
          x: Joi.number().required(),
          y: Joi.number().required()
        }).optional()
      })).optional(),
      url: Joi.string().optional()
    })).optional(),
    song: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
    songStart: Joi.number().optional(),
    songEnd: Joi.number().optional(),
    thumbnailURL: Joi.string().optional(),
    description: Joi.array().items(Joi.object({
      mention: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      hashTag: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      text: Joi.string().when(Joi.object({ mention: Joi.exist() }).unknown(), {
        then: Joi.required(),
        otherwise: Joi.when(Joi.object({ hashTag: Joi.exist() }).unknown(), {
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    })).optional(),
    location: Joi.string().optional(),
    collabs: Joi.array().items(Joi.object({
      user: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
      position: Joi.object({
        x: Joi.number().optional(),
        y: Joi.number().optional()
      }).required()
    })).optional(),
    commentVisible: Joi.boolean().optional(),
    likeVisible: Joi.boolean().optional(),
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
    fileType: Joi.string().required(),
    fileName: Joi.string().required(),
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
    caption: Joi.string().optional(),
    song: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
    mediaURL: Joi.string().required(),
    thumbnailURL: Joi.string().required(),
    songStart: Joi.number().optional(),
    songEnd: Joi.number().optional(),
    hashTags: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()).optional(),
    newHashTag: Joi.array().items(Joi.object({
      id : Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
      value: Joi.string().required()
    })).optional(),
    mention : Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()).optional(),
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
    media: Joi.array()
      .items(Joi.string()
        .pattern(new RegExp(`^${config.R2.R2_PUBLIC_URL}/.+$`))
        .message("Each media item must be a valid URL"))
      .required(),
    thumbnailURL: Joi.string()
      .pattern(new RegExp(`^${config.R2.R2_PUBLIC_URL}/.+$`))
      .message("thumbnailURL must be a valid URL")
      .required(),
    mode: Joi.string().valid("GoFlick", "OnFlick").required(),
    location: Joi.string().required(),
    coords: Joi.object({
      lat: Joi.number().required(),
      long: Joi.number().required()
    }).required(),  // Ensure `coords` is required
    maxApplicants: Joi.number().required(),
    totalAmount: Joi.number().required(),
  });
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
    description: Joi.array().items(Joi.object({
      mention: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      hashTag: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      text: Joi.string().when(Joi.object({ mention: Joi.exist() }).unknown(), {
        then: Joi.required(),
        otherwise: Joi.when(Joi.object({ hashTag: Joi.exist() }).unknown(), {
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    })).required(),
    partialAllowance: Joi.boolean().required(),
    media: Joi.array().items(Joi.object({
      url: Joi.string()
        .pattern(new RegExp(`^${config.R2.R2_PUBLIC_URL}/.+$`))
        .message("url must be a valid URL").required(),
      thumbnail: Joi.string().pattern(new RegExp(`^${config.R2.R2_PUBLIC_URL}/.+$`))
        .message("thumbnail must be a valid URL").required(),
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
      fileType: Joi.string().required(),
      fileName: Joi.string().required(),
    })).required(),
  })
  const { error } = schema.validate(body)
  return error
}

export const validatePresinedURLQuest = (body: object) => {
  const schema = Joi.object({
    media: Joi.array().items(Joi.object({
      fileName: Joi.string().required(),
      fileType: Joi.string().required()
    }))
  })
  const { error } = schema.validate(body)
  return error
}

export const validatePresignedURLReport = (body: object) => {
  const schema = Joi.object({
    attachment: Joi.array().items(Joi.object({
      fileName: Joi.string().required(),
      fileType: Joi.string().required()
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
    description: Joi.array().items(Joi.object({
      mention: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      hashTag: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      text: Joi.string().when(Joi.object({ mention: Joi.exist() }).unknown(), {
        then: Joi.required(),
        otherwise: Joi.when(Joi.object({ hashTag: Joi.exist() }).unknown(), {
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    })).required(),
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

export const validateLikeToggle = (body: object, query: object) => {
  const bodySchema = Joi.object({
    value: Joi.boolean().required()
  })
  const querySchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
    type: Joi.string().valid("flick", "comment", "quest").required(),
  })
  const combinedSchema = Joi.object({
    body: bodySchema,
    query: querySchema
  })
  const { error } = combinedSchema.validate({ body, query })
  return error
}

export const validateGetAllLikes = (query: object) => {
  const schema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
    type: Joi.string().valid("flick", "comment", "quest").required(),
  })
  const { error } = schema.validate(query)
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

export const validateSessionId = (params: object) => {
  const schema = Joi.object({
    sessionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
  })
  const { error } = schema.validate(params)
  return error
}

export const validateRefreshToken = (body: object) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required()
  })
  const { error } = schema.validate(body)
  return error
}






export const validateUpdateProfile = (body: object) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    gender: Joi.string().optional(),
    phone: Joi.string()
      .optional()
      .pattern(REGEX.PHONE)
      .messages({
        'string.pattern.base': 'Phone number must be a valid international format',
      }),
    description: Joi.array().items(Joi.object({
      mention: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      hashTag: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').optional(),
      text: Joi.string().when(Joi.object({ mention: Joi.exist() }).unknown(), {
        then: Joi.required(),
        otherwise: Joi.when(Joi.object({ hashTag: Joi.exist() }).unknown(), {
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      }),
    })).optional(),
    username: Joi.string().optional()
      .min(4)
      .max(30)
      .regex(REGEX.USERNAME)
      .messages({
        "string.pattern.base": "Invalid username format",
      }),
    dob: Joi.string().isoDate().optional(),
    country: Joi.string().optional().custom((value, helpers) => {
      // Check if country exists in your predefined countries list
      if (!countries.some(e => e.code === value)) {
        return helpers.error("any.invalid", { message: "Country is not valid" });
      }
      return value;
    }),
    newHashTag: Joi.array().items(Joi.object({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
      value: Joi.string().required()
    })).optional(),
    photo: Joi.string()
      .pattern(new RegExp(`^${config.R2.R2_PUBLIC_URL}/.+$`))
      .message("photo must be a valid URL").optional(),
  })
  const { error } = schema.validate(body)
  return error
}



export const validatePassword = (body: object) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    newPassword: Joi.string().required()
  })
  const { error } = schema.validate(body)
  return error
}


export const validateUpdateNotificationSetting = (body: object) => {
  const schema = Joi.object({
    pauseAll: Joi.boolean().optional(),
    likes: Joi.string().valid("everyone", "following", "none").optional(),
    comments: Joi.string().valid("everyone", "following", "none").optional(),
    tagged: Joi.string().valid("everyone", "following", "none").optional(),
    addToPost: Joi.string().valid("everyone", "following", "none").optional(),
    storyReaction: Joi.string().valid("everyone", "following", "none").optional(),
    storyComment: Joi.string().valid("everyone", "following", "none").optional(),
    storyTagged: Joi.string().valid("everyone", "following", "none").optional(),
    message: Joi.string().valid("everyone", "following", "none").optional(),
    messageRequest: Joi.string().valid("everyone", "following", "none").optional(),
    messageRequestGroup: Joi.string().valid("everyone", "following", "none").optional(),
    newFollower: Joi.string().valid("everyone", "following", "none").optional(),
    newFollowing: Joi.string().valid("everyone", "following", "none").optional(),
    acceptedFollower: Joi.string().valid("everyone", "following", "none").optional(),
    suggestedFollower: Joi.string().valid("everyone", "following", "none").optional(),
    profileMention: Joi.string().valid("everyone", "following", "none").optional(),
    audioCall: Joi.string().valid("everyone", "following", "none").optional(),
    videoCall: Joi.string().valid("everyone", "following", "none").optional(),
    liveVideoStart: Joi.string().valid("everyone", "following", "none").optional(),
    liveVideoEnd: Joi.string().valid("everyone", "following", "none").optional(),
    recentlyUploaded: Joi.string().valid("everyone", "following", "none").optional(),
    repost: Joi.string().valid("everyone", "following", "none").optional(),
    audio: Joi.string().valid("everyone", "following", "none").optional(),
    mostWatched: Joi.string().valid("everyone", "following", "none").optional(),
    createdAQuest: Joi.array().items(Joi.string().valid("all", "everyone", "following", "goflick", "onflick", "none")).optional(),
    sponsoredQuest: Joi.array().items(Joi.string().valid("all", "goflick", "onflick", "node")).optional(),
    appliedForQuest: Joi.string().valid("everyone", "following", "none").optional(),
    likedQuest: Joi.string().valid("everyone", "following", "none").optional(),
    questUpdates: Joi.string().valid("everyone", "following", "none").optional(),
    creditedTxn: Joi.string().valid("everyone", "following", "none").optional(),
    debitedTxn: Joi.string().valid("everyone", "following", "none").optional(),
    flickstarTxn: Joi.string().valid("everyone", "following", "none").optional(),
    support: Joi.string().valid("everyone", "following", "none").optional(),
    trending: Joi.string().valid("everyone", "following", "none").optional(),
    feedback: Joi.string().valid("everyone", "following", "none").optional(),
    achievement: Joi.string().valid("everyone", "following", "none").optional(),
    newFeatures: Joi.string().valid("everyone", "following", "none").optional(),
    followingActivity: Joi.string().valid("everyone", "following", "none").optional(),
    engagement: Joi.string().valid("everyone", "following", "none").optional(),
    socialCause: Joi.string().valid("everyone", "following", "none").optional(),
    birthDay: Joi.string().valid("everyone", "following", "none").optional(),
    shareBirthday: Joi.string().valid("everyone", "following", "none").optional(),
    loginAlert: Joi.string().valid("everyone", "following", "none").optional(),
  })
  const { error } = schema.validate(body)
  return error
}




export const validateUsername = (body: object) => {
  const schema = Joi.object({
    username: Joi.string().required()
      .min(4)
      .max(30)
      .regex(REGEX.USERNAME)
      .messages({
        "string.pattern.base": "Invalid username format",
      }),
  })
  const { error } = schema.validate(body)
  return error
}

export const validateEmail = (body: object) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
  })
  const { error } = schema.validate(body)
  return error
}


//Payment 




export const validateCreatePayments = (body: object) => {
  const schema = Joi.object({
    stripeAccountId: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().optional()
  })
  const { error } = schema.validate(body)
  return error
}