export const REGEX = {
    TEXT_NON_SPECIAL_CHARACTER_NO_WHITE_SPACE: /^(?=.*[^\s])[a-zA-Z\s]+$/,
    PHONE_NUMBER: /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6-9]\d{9}$/,
    TIME: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/,
    NAME: /^[a-zA-Z]+$/,
    MIDDLE_NAME: /^[a-zA-Z]*$/
}