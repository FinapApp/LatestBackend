export const REGEX = {
    TEXT_NON_SPECIAL_CHARACTER_NO_WHITE_SPACE: /^(?=.*[^\s])[a-zA-Z\s]+$/,
    PHONE_NUMBER: /^\+?[1-9][0-9]{7,14}$/,
    TIME: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/,
    NAME: /^[a-zA-Z]+$/,
    MIDDLE_NAME: /^[a-zA-Z]*$/,
    USERNAME: /^(?!\d+$)(?!\.)(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*$/,
    PHONE: /^\+?[1-9]\d{1,14}$/
}

