import { Response } from "express";
export type Lang = "en" | "ru" | "uz" | "hi";

export const getMessage = (content: any, lang: Lang): string | null => {
  if (!content) return null;
  if (typeof content === "string") return content; // if it's not an object with languages
  return content[lang] ?? content["en"] ?? null;
};

/**
 * Sends a consistent API response with localized messages.
 */
export const handleResponse = (
  res: Response,
  statusCode: number,
  value: any,
  lang: Lang = "en",
  meta: Array<any> = []
) => {
  if (res.headersSent) return;

  const selectedMessage =
    getMessage(meta?.[0], lang) || getMessage(value, lang);

  if (statusCode > 205) {
    return res.status(statusCode).json({
      success: false,
      message: selectedMessage,
      details: meta.length ? meta : undefined,
    });
  }

  if (selectedMessage) {
    return res.status(statusCode).json({
      success: true,
      message: selectedMessage,
    });
  }

  return res.status(statusCode).json({
    success: true,
    data: { ...(value || {}) },
  });
};

export const errors = {
  presigned_url: {
    
      en: "Unable to generate a presigned URL. Please try again.",
      ru: "Не удалось сгенерировать предзнаменованный URL. Пожалуйста, попробуйте еще раз.",
      uz: "Imzolangan URL yaratib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "पूर्व-हस्ताक्षरित URL उत्पन्न नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },

  // Wallet-related errors
  wallet_not_found: {
    
      en: "Wallet could not be found. Please check your account details.",
      ru: "Кошелек не найден. Пожалуйста, проверьте данные аккаунта.",
      uz: "Hamyon topilmadi. Iltimos, hisob ma'lumotlarini tekshiring.",
      hi: "वॉलेट नहीं मिला। कृपया अपने खाते का विवरण जांचें।"
  },
  insufficient_balance: {
    
      en: "Your wallet does not have sufficient balance to complete this transaction.",
      ru: "На вашем кошельке недостаточно средств для завершения транзакции.",
      uz: "Hamyoningizda ushbu tranzaksiyani amalga oshirish uchun yetarli mablag' yo'q.",
      hi: "आपके वॉलेट में इस लेन-देन को पूरा करने के लिए पर्याप्त शेष नहीं है।"
  },
  // Referral Code
  referral_code_not_found: {
    
      en: "The referral code entered is invalid or does not exist.",
      ru: "Введенный реферальный код недействителен или не существует.",
      uz: "Kiritilgan referal kod noto'g'ri yoki mavjud emas.",
      hi: "दर्ज किया गया रेफरल कोड अमान्य है या मौजूद नहीं है।"
  },
  cannot_use_own_referral_code: {
    
      en: "You cannot use your own referral code. Please enter a different code.",
      ru: "Вы не можете использовать свой собственный реферальный код. Пожалуйста, введите другой код.",
      uz: "O'zingizning referal kodingizni ishlata olmaysiz. Iltimos, boshqa kod kiriting.",
      hi: "आप अपना खुद का रेफरल कोड उपयोग नहीं कर सकते। कृपया कोई अन्य कोड दर्ज करें।"
  },
  referral_code_already_used: {
    
      en: "This referral code has already been used.",
      ru: "Этот реферальный код уже был использован.",
      uz: "Bu referal kod allaqachon ishlatilgan.",
      hi: "यह रेफरल कोड पहले ही उपयोग किया जा चुका है।"
  },
  invalid_qr_string: {
    
      en: "The provided QR code is invalid. Please try again.",
      ru: "Предоставленный QR-код недействителен. Пожалуйста, попробуйте снова.",
      uz: "Berilgan QR kod noto'g'ri. Iltimos, yana urinib ko'ring.",
      hi: "प्रदान किया गया QR कोड अमान्य है। कृपया पुनः प्रयास करें।"
  },
  // Permission-related errors
  permission_denied: {
    
      en: "You do not have permission to perform this action.",
      ru: "У вас нет разрешения на выполнение этого действия.",
      uz: "Sizda bu amalni bajarishga ruxsat yo'q.",
      hi: "आपको यह क्रिया करने की अनुमति नहीं है।"
  },
  // Feature-reported-issues
  create_feature_issue: {
    
      en: "We were unable to create your feature issue. Please try again later.",
      ru: "Не удалось создать ваш запрос на функцию. Пожалуйста, попробуйте позже.",
      uz: "Funktsiya muammosini yaratib bo'lmadi. Iltimos, keyinroq urinib ko'ring.",
      hi: "हम आपकी फीचर समस्या नहीं बना सके। कृपया बाद में पुनः प्रयास करें।"
  },
  user_deactivated: {
    
      en: "This user account has been deactivated.",
      ru: "Этот аккаунт пользователя был деактивирован.",
      uz: "Ushbu foydalanuvchi akkaunti o'chirilgan.",
      hi: "यह उपयोगकर्ता खाता निष्क्रिय कर दिया गया है।"
  },
  // Deactivate Account
  deactivate_account: {
    
      en: "We were unable to deactivate your account at this time.",
      ru: "Не удалось деактивировать ваш аккаунт в данный момент.",
      uz: "Akkauntingizni hozirda o'chirib bo'lmadi.",
      hi: "हम इस समय आपका खाता निष्क्रिय नहीं कर सके।"
  },
  // Song-related errors
  song_not_uploaded: {
    
      en: "The song could not be uploaded. Please try again.",
      ru: "Песню не удалось загрузить. Пожалуйста, попробуйте снова.",
      uz: "Qo'shiq yuklanmadi. Iltimos, yana urinib ko'ring.",
      hi: "गाना अपलोड नहीं हो सका। कृपया पुनः प्रयास करें।"
  },
  // Search-related errors
  search_history_not_found: {
    
      en: "No search history found.",
      ru: "История поиска не найдена.",
      uz: "Qidiruv tarixi topilmadi.",
      hi: "कोई खोज इतिहास नहीं मिला।"
  },
  search_history_not_updated: {
    
      en: "Unable to update search history. Please try again.",
      ru: "Не удалось обновить историю поиска. Пожалуйста, попробуйте снова.",
      uz: "Qidiruv tarixini yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "खोज इतिहास अपडेट नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  search_history_not_deleted: {
    
      en: "Unable to delete search history. Please try again.",
      ru: "Не удалось удалить историю поиска. Пожалуйста, попробуйте снова.",
      uz: "Qidiruv tarixini o'chirib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "खोज इतिहास हटाया नहीं जा सका। कृपया पुनः प्रयास करें।"
  },
  search_history_created: {
    
      en: "Search history was created, but with issues. Please review.",
      ru: "История поиска была создана, но с проблемами. Пожалуйста, проверьте.",
      uz: "Qidiruv tarixi yaratildi, lekin muammolar bilan. Iltimos, tekshiring.",
      hi: "खोज इतिहास बनाया गया, लेकिन समस्याओं के साथ। कृपया समीक्षा करें।"
  },
  // Bio-links related errors
  bio_link_not_found: {
    
      en: "The requested bio-link could not be found.",
      ru: "Запрошенная биоссылка не найдена.",
      uz: "So'ralgan bio-link topilmadi.",
      hi: "अनुरोधित बायो-लिंक नहीं मिला।"
  },
  bio_link_not_updated: {
    
      en: "Unable to update the bio-link. Please try again.",
      ru: "Не удалось обновить биоссылку. Пожалуйста, попробуйте снова.",
      uz: "Bio-linkni yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "बायो-लिंक अपडेट नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  bio_link_not_created: {
    
      en: "Unable to create the bio-link. Please try again.",
      ru: "Не удалось создать биоссылку. Пожалуйста, попробуйте снова.",
      uz: "Bio-linkni yaratib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "बायो-लिंक बनाया नहीं जा सका। कृपया पुनः प्रयास करें।"
  },
  bio_link_not_deleted: {
    
      en: "Unable to delete the bio-link. Please try again.",
      ru: "Не удалось удалить биоссылку. Пожалуйста, попробуйте снова.",
      uz: "Bio-linkni o'chirib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "बायो-लिंक हटाया नहीं जा सका। कृपया पुनः प्रयास करें।"
  },
  // HashTags
  no_hashtags: {
    
      en: "No hashtags were found for your request.",
      ru: "По вашему запросу не найдено хэштегов.",
      uz: "So'rovingiz bo'yicha hashtaglar topilmadi.",
      hi: "आपके अनुरोध के लिए कोई हैशटैग नहीं मिला।"
  },
  create_hashtags: {
    
      en: "Unable to create hashtags at this time.",
      ru: "Не удалось создать хэштеги в данный момент.",
      uz: "Hashtaglarni hozirda yaratib bo'lmadi.",
      hi: "इस समय हैशटैग नहीं बनाए जा सके।"
  },
  // Two-factor authentication-related errors
  update_two_factor: {
    
      en: "Unable to update two-factor authentication settings.",
      ru: "Не удалось обновить настройки двухфакторной аутентификации.",
      uz: "Ikki faktorli autentifikatsiya sozlamalarini yangilab bo'lmadi.",
      hi: "दो-कारक प्रमाणीकरण सेटिंग्स अपडेट नहीं की जा सकीं।"
  },
  get_two_factor: {
    
      en: "Unable to retrieve two-factor authentication settings.",
      ru: "Не удалось получить настройки двухфакторной аутентификации.",
      uz: "Ikki faktorli autentifikatsiya sozlamalarini olishda xatolik.",
      hi: "दो-कारक प्रमाणीकरण सेटिंग्स प्राप्त नहीं की जा सकीं।"
  },
  // Notification-related errors
  user_notification_not_found: {
    
      en: "Unable to retrieve notifications at this time.",
      ru: "Не удалось получить уведомления в данный момент.",
      uz: "Bildirishnomalarni hozirda olishda xatolik.",
      hi: "इस समय सूचनाएं प्राप्त नहीं की जा सकीं।"
  },
  update_notification_setting: {
    
      en: "Unable to update notification settings. Please try again.",
      ru: "Не удалось обновить настройки уведомлений. Пожалуйста, попробуйте снова.",
      uz: "Bildirishnoma sozlamalarini yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "सूचना सेटिंग्स अपडेट नहीं की जा सकीं। कृपया पुनः प्रयास करें।"
  },
  // Profile-related errors
  profile_image_deleted: {
    
      en: "Profile image was deleted, but with issues. Please review.",
      ru: "Изображение профиля было удалено, но с проблемами. Пожалуйста, проверьте.",
      uz: "Profil rasmi o'chirildi, lekin muammolar bilan. Iltimos, tekshiring.",
      hi: "प्रोफ़ाइल छवि हटाई गई, लेकिन समस्याओं के साथ। कृपया समीक्षा करें।"
  },
  unable_to_signed_profile_image: {
    
      en: "Unable to generate a signed URL for your profile image.",
      ru: "Не удалось создать подписанный URL для изображения профиля.",
      uz: "Profil rasmi uchun imzolangan URL yaratib bo'lmadi.",
      hi: "आपकी प्रोफ़ाइल छवि के लिए साइन किया गया URL उत्पन्न नहीं किया जा सका।"
  },
  profile_not_updated: {
    
      en: "Unable to update your profile. Please try again.",
      ru: "Не удалось обновить ваш профиль. Пожалуйста, попробуйте снова.",
      uz: "Profilingizni yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "आपकी प्रोफ़ाइल अपडेट नहीं की जा सकी। कृपया पुनः प्रयास करें।"
  },
  profile_not_found: {
    
      en: "Profile not found. Please check your account details.",
      ru: "Профиль не найден. Пожалуйста, проверьте данные аккаунта.",
      uz: "Profil topilmadi. Iltimos, hisob ma'lumotlarini tekshiring.",
      hi: "प्रोफ़ाइल नहीं मिली। कृपया अपने खाते का विवरण जांचें।"
  },
  // Password-related errors
  password_not_updated: {
    
      en: "Unable to update your password. Please try again.",
      ru: "Не удалось обновить ваш пароль. Пожалуйста, попробуйте снова.",
      uz: "Parolingizni yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "आपका पासवर्ड अपडेट नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  // User-related errors
  unable_to_create_user: {
    
      en: "Unable to create user account. Please try again later.",
      ru: "Не удалось создать аккаунт пользователя. Пожалуйста, попробуйте позже.",
      uz: "Foydalanuvchi akkauntini yaratib bo'lmadi. Iltimos, keyinroq urinib ko'ring.",
      hi: "उपयोगकर्ता खाता नहीं बनाया जा सका। कृपया बाद में पुनः प्रयास करें।"
  },
  user_not_found: {
    
      en: "User not found. Please check your credentials.",
      ru: "Пользователь не найден. Пожалуйста, проверьте свои данные.",
      uz: "Foydalanuvchi topilmadi. Iltimos, ma'lumotlaringizni tekshiring.",
      hi: "उपयोगकर्ता नहीं मिला। कृपया अपनी जानकारी जांचें।"
  },
  username_exist: {
    
      en: "This username is already taken. Please choose another.",
      ru: "Это имя пользователя уже занято. Пожалуйста, выберите другое.",
      uz: "Bu foydalanuvchi nomi allaqachon band. Iltimos, boshqasini tanlang.",
      hi: "यह उपयोगकर्ता नाम पहले ही लिया जा चुका है। कृपया कोई अन्य चुनें।"
  },
  phone_exist: {
    
      en: "This phone number is already associated with another account.",
      ru: "Этот номер телефона уже связан с другим аккаунтом.",
      uz: "Bu telefon raqami boshqa akkauntga bog'langan.",
      hi: "यह फ़ोन नंबर पहले से ही किसी अन्य खाते से जुड़ा है।"
  },
  phone_not_found: {
    
      en: "Phone number not found. Please check and try again.",
      ru: "Номер телефона не найден. Пожалуйста, проверьте и попробуйте снова.",
      uz: "Telefon raqami topilmadi. Iltimos, tekshirib yana urinib ko'ring.",
      hi: "फ़ोन नंबर नहीं मिला। कृपया जांचें और पुनः प्रयास करें।"
  },
  email_exist: {
    
      en: "This email address is already registered.",
      ru: "Этот адрес электронной почты уже зарегистрирован.",
      uz: "Bu elektron pochta manzili allaqachon ro'yxatdan o'tgan.",
      hi: "यह ईमेल पता पहले ही पंजीकृत है।"
  },
  email_not_found: {
    
      en: "Email address not found. Please check and try again.",
      ru: "Адрес электронной почты не найден. Пожалуйста, проверьте и попробуйте снова.",
      uz: "Elektron pochta manzili topilmadi. Iltimos, tekshirib yana urinib ko'ring.",
      hi: "ईमेल पता नहीं मिला। कृपया जांचें और पुनः प्रयास करें।"
  },
  invalid_credentials: {
    
      en: "The credentials provided are invalid. Please try again.",
      ru: "Предоставленные учетные данные недействительны. Пожалуйста, попробуйте снова.",
      uz: "Kiritilgan ma'lumotlar noto'g'ri. Iltimos, yana urinib ko'ring.",
      hi: "प्रदान की गई जानकारी अमान्य है। कृपया पुनः प्रयास करें।"
  },
  incorrect_password: {
    
      en: "Incorrect password. Please try again.",
      ru: "Неверный пароль. Пожалуйста, попробуйте снова.",
      uz: "Parol noto'g'ri. Iltimos, yana urinib ko'ring.",
      hi: "गलत पासवर्ड। कृपया पुनः प्रयास करें।"
  },
  unauthorized: {
    
      en: "You are not authorized to perform this action.",
      ru: "У вас нет прав для выполнения этого действия.",
      uz: "Sizda bu amalni bajarishga ruxsat yo'q.",
      hi: "आपको यह क्रिया करने की अनुमति नहीं है।"
  },
  user_reported: {
    
      en: "Unable to report this user at the moment.",
      ru: "Не удалось пожаловаться на этого пользователя в данный момент.",
      uz: "Ushbu foydalanuvchini hozirda shikoyat qilib bo'lmadi.",
      hi: "इस समय इस उपयोगकर्ता की रिपोर्ट नहीं की जा सकी।"
  },
  ai_content_reported: {
    
      en: "Unable to report this AI content at the moment.",
      ru: "Не удалось пожаловаться на этот AI-контент в данный момент.",
      uz: "Ushbu AI kontentni hozirda shikoyat qilib bo'lmadi.",
      hi: "इस समय इस AI सामग्री की रिपोर्ट नहीं की जा सकी।"
  },
  user_not_authorized: {
    
      en: "You are not authorized to perform this action.",
      ru: "У вас нет прав для выполнения этого действия.",
      uz: "Sizda bu amalni bajarishga ruxsat yo'q.",
      hi: "आपको यह क्रिया करने की अनुमति नहीं है।"
  },
  user_followed: {
    
      en: "Unable to follow this user. Please try again.",
      ru: "Не удалось подписаться на этого пользователя. Пожалуйста, попробуйте снова.",
      uz: "Ushbu foydalanuvchini kuzatib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "इस उपयोगकर्ता को फॉलो नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  toggle_follow: {
    
      en: "Unable to update follow status. Please try again.",
      ru: "Не удалось обновить статус подписки. Пожалуйста, попробуйте снова.",
      uz: "Kuzatuv holatini yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "फॉलो स्थिति अपडेट नहीं की जा सकी। कृपया पुनः प्रयास करें।"
  },
  user_unfollowed: {
    
      en: "Unable to unfollow this user. Please try again.",
      ru: "Не удалось отписаться от этого пользователя. Пожалуйста, попробуйте снова.",
      uz: "Ushbu foydalanuvchini kuzatishni to'xtatib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "इस उपयोगकर्ता को अनफॉलो नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  follow_not_found: {
    
      en: "You are not following this user.",
      ru: "Вы не подписаны на этого пользователя.",
      uz: "Siz ushbu foydalanuvchini kuzatmaysiz.",
      hi: "आप इस उपयोगकर्ता को फॉलो नहीं कर रहे हैं।"
  },
  self_follow: {
    
      en: "You cannot follow yourself.",
      ru: "Вы не можете подписаться на себя.",
      uz: "O'zingizni kuzata olmaysiz.",
      hi: "आप खुद को फॉलो नहीं कर सकते।"
  },
  follower_removed: {
    
      en: "Follower was removed, but with issues. Please review.",
      ru: "Подписчик был удален, но с проблемами. Пожалуйста, проверьте.",
      uz: "Kuzatuvchi o'chirildi, lekin muammolar bilan. Iltimos, tekshiring.",
      hi: "फॉलोवर हटाया गया, लेकिन समस्याओं के साथ। कृपया समीक्षा करें।"
  },
  // Session-related errors
  session_not_found: {
    
      en: "Session not found. Please log in again.",
      ru: "Сессия не найдена. Пожалуйста, войдите снова.",
      uz: "Sessiya topilmadi. Iltimos, qayta tizimga kiring.",
      hi: "सत्र नहीं मिला। कृपया पुनः लॉगिन करें।"
  },
  session_deleted: {
    
      en: "Unable to delete session. Please try again.",
      ru: "Не удалось удалить сессию. Пожалуйста, попробуйте снова.",
      uz: "Sessiyani o'chirib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "सत्र हटाया नहीं जा सका। कृपया पुनः प्रयास करें।"
  },
  // Flick-related errors
  flick_not_found: {
    
      en: "The requested flick could not be found.",
      ru: "Запрошенный флик не найден.",
      uz: "So'ralgan flick topilmadi.",
      hi: "अनुरोधित फ्लिक नहीं मिला।"
  },
  flick_uploaded: {
    
      en: "Unable to upload flick. Please try again.",
      ru: "Не удалось загрузить флик. Пожалуйста, попробуйте снова.",
      uz: "Flickni yuklab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "फ्लिक अपलोड नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  flick_created: {
    
      en: "Unable to create flick. Please try again.",
      ru: "Не удалось создать флик. Пожалуйста, попробуйте снова.",
      uz: "Flickni yaratib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "फ्लिक बनाया नहीं जा सका। कृपया पुनः प्रयास करें।"
  },
  flick_updated: {
    
      en: "Unable to update flick. Please try again.",
      ru: "Не удалось обновить флик. Пожалуйста, попробуйте снова.",
      uz: "Flickni yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "फ्लिक अपडेट नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  flick_deleted: {
    
      en: "Unable to delete flick. Please try again.",
      ru: "Не удалось удалить флик. Пожалуйста, попробуйте снова.",
      uz: "Flickni o'chirib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "फ्लिक हटाया नहीं जा सका। कृपया पुनः प्रयास करें।"
  },
  flick_reported: {
    
      en: "Unable to report this flick at the moment.",
      ru: "Не удалось пожаловаться на этот флик в данный момент.",
      uz: "Ushbu flickni hozirda shikoyat qilib bo'lmadi.",
      hi: "इस समय इस फ्लिक की रिपोर्ट नहीं की जा सकी।"
  },
  no_flicks: {
    
      en: "No flicks found for your request.",
      ru: "По вашему запросу не найдено фликов.",
      uz: "So'rovingiz bo'yicha flicklar topilmadi.",
      hi: "आपके अनुरोध के लिए कोई फ्लिक नहीं मिला।"
  },
  toggle_like: {
    
      en: "Unable to update like status. Please try again.",
      ru: "Не удалось обновить статус лайка. Пожалуйста, попробуйте снова.",
      uz: "Like holatini yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "लाइक स्थिति अपडेट नहीं की जा सकी। कृपया पुनः प्रयास करें।"
  },
  status_changed_flicked: {
    
      en: "Unable to change flick status. Please try again.",
      ru: "Не удалось изменить статус флика. Пожалуйста, попробуйте снова.",
      uz: "Flick holatini o'zgartirib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "फ्लिक स्थिति बदल नहीं सकी। कृपया पुनः प्रयास करें।"
  },
  // Story-related errors
  story_already_exists: {
    
      en: "A story already exists for this context.",
      ru: "История уже существует для этого контекста.",
      uz: "Ushbu kontekst uchun hikoya allaqachon mavjud.",
      hi: "इस संदर्भ के लिए पहले से ही एक कहानी मौजूद है।"
  },
    story_uploaded: {
        en: "Unable to upload story. Please try again.",
        ru: "Не удалось загрузить историю. Пожалуйста, попробуйте снова.",
        uz: "Hikoyani yuklab bo'lmadi. Iltimos, yana urinib ko'ring.",
        hi: "कहानी अपलोड नहीं की जा सकी। कृपया पुनः प्रयास करें।"
    },
  story_deleted: {
      en: "Unable to delete story. Please try again.",
      ru: "Не удалось удалить историю. Пожалуйста, попробуйте снова.",
      uz: "Hikoyani o'chirib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "कहानी हटाई नहीं जा सकी। कृपया पुनः प्रयास करें।"
  },
  story_reported: {
    
      en: "Unable to report this story at the moment.",
      ru: "Не удалось пожаловаться на эту историю в данный момент.",
      uz: "Ushbu hikoyani hozirda shikoyat qilib bo'lmadi.",
      hi: "इस समय इस कहानी की रिपोर्ट नहीं की जा सकी।"
  },
  add_story_viewer: {
    
      en: "Unable to add viewer to story. Please try again.",
      ru: "Не удалось добавить зрителя к истории. Пожалуйста, попробуйте снова.",
      uz: "Hikoyaga tomoshabinni qo'shib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "कहानी में दर्शक नहीं जोड़ा जा सका। कृपया पुनः प्रयास करें।"
  },
  get_story_view: {
    
      en: "Unable to retrieve story view. Please try again.",
      ru: "Не удалось получить просмотр истории. Пожалуйста, попробуйте снова.",
      uz: "Hikoya ko'rinishini olishda xatolik. Iltimos, yana urinib ko'ring.",
      hi: "कहानी दृश्य प्राप्त नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  // Comment-related errors
  comment_flick_mismatch: {
    
      en: "The comment does not belong to the specified flick.",
      ru: "Комментарий не относится к указанному флику.",
      uz: "Izoh ko'rsatilgan flickga tegishli emas.",
      hi: "टिप्पणी निर्दिष्ट फ्लिक से संबंधित नहीं है।"
  },
  comment_not_authorized: {
    
      en: "You are not authorized to perform this comment action.",
      ru: "У вас нет прав для выполнения этого действия с комментарием.",
      uz: "Sizda bu izoh amalini bajarishga ruxsat yo'q.",
      hi: "आपको यह टिप्पणी क्रिया करने की अनुमति नहीं है।"
  },
  comment_not_found: {
    
      en: "Comment not found.",
      ru: "Комментарий не найден.",
      uz: "Izoh topilmadi.",
      hi: "टिप्पणी नहीं मिली।"
  },
  comment_delete: {
    
      en: "Unable to delete comment. Please try again.",
      ru: "Не удалось удалить комментарий. Пожалуйста, попробуйте снова.",
      uz: "Izohni o'chirib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "टिप्पणी हटाई नहीं जा सकी। कृपया पुनः प्रयास करें।"
  },
  comment_reported: {
    
      en: "Unable to report this comment at the moment.",
      ru: "Не удалось пожаловаться на этот комментарий в данный момент.",
      uz: "Ushbu izohni hozirda shikoyat qilib bo'lmadi.",
      hi: "इस समय इस टिप्पणी की रिपोर्ट नहीं की जा सकी।"
  },
  create_comment: {
    
      en: "Unable to create comment. Please try again.",
      ru: "Не удалось создать комментарий. Пожалуйста, попробуйте снова.",
      uz: "Izoh yaratib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "टिप्पणी बनाई नहीं जा सकी। कृपया पुनः प्रयास करें।"
  },
  update_comment: {
    
      en: "Unable to update comment. Please try again.",
      ru: "Не удалось обновить комментарий. Пожалуйста, попробуйте снова.",
      uz: "Izohni yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "टिप्पणी अपडेट नहीं की जा सकी। कृपया पुनः प्रयास करें।"
  },
  // Feedback-related errors
  update_feedback: {
    
      en: "Unable to update feedback. Please try again.",
      ru: "Не удалось обновить отзыв. Пожалуйста, попробуйте снова.",
      uz: "Fikr-mulohazani yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "प्रतिक्रिया अपडेट नहीं की जा सकी। कृपया पुनः प्रयास करें।"
  },
  get_feedback: {
    
      en: "Unable to retrieve feedback. Please try again.",
      ru: "Не удалось получить отзыв. Пожалуйста, попробуйте снова.",
      uz: "Fikr-mulohazani olishda xatolik. Iltimos, yana urinib ko'ring.",
      hi: "प्रतिक्रिया प्राप्त नहीं की जा सकी। कृपया पुनः प्रयास करें।"
  },
  delete_feedback: {
    
      en: "Unable to delete feedback. Please try again.",
      ru: "Не удалось удалить отзыв. Пожалуйста, попробуйте снова.",
      uz: "Fikr-mulohazani o'chirib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "प्रतिक्रिया हटाई नहीं जा सकी। कृपया पुनः प्रयास करें।"
  },
  create_feedback: {
    
      en: "Unable to create feedback. Please try again.",
      ru: "Не удалось создать отзыв. Пожалуйста, попробуйте снова.",
      uz: "Fikr-mulohaza yaratib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "प्रतिक्रिया बनाई नहीं जा सकी। कृपया पुनः प्रयास करें।"
  },
  // Theme-related errors 
  update_theme: {
    
      en: "Unable to update theme settings. Please try again.",
      ru: "Не удалось обновить настройки темы. Пожалуйста, попробуйте снова.",
      uz: "Mavzu sozlamalarini yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "थीम सेटिंग्स अपडेट नहीं की जा सकीं। कृपया पुनः प्रयास करें।"
  },
  get_theme: {
    
      en: "Unable to retrieve theme settings. Please try again.",
      ru: "Не удалось получить настройки темы. Пожалуйста, попробуйте снова.",
      uz: "Mavzu sozlamalarini olishda xatolik. Iltimos, yana urinib ko'ring.",
      hi: "थीम सेटिंग्स प्राप्त नहीं की जा सकीं। कृपया पुनः प्रयास करें।"
  },
  // Quest-related errors
  quest_applicant_had_already_won: {
      en: "Quest Applicant has already won. Status changes are not allowed.",
        ru: "У заявителя квеста уже есть победа. Изменения статуса не разрешены.",
        uz: "Quest arizachisi allaqachon g'alaba qozongan. Holat o'zgarishlari ruxsat etilmaydi.",
        hi: "क्वेस्ट आवेदक पहले ही जीत चुका है। स्थिति परिवर्तन की अनुमति नहीं है।"
  },
  quest_status_cannot_revert: {
    
      en: "Status cannot be reverted back to pending once changed.",
      ru: "Статус не может быть возвращен в ожидание после изменения.",
      uz: "Holat o'zgartirilgandan so'ng, yana kutish holatiga qaytarib bo'lmaydi.",
      hi: "एक बार बदले जाने के बाद स्थिति को फिर से लंबित पर नहीं लाया जा सकता।"
    // One or more applicants belong to a quest that is already deposited.Status changes are not allowed.
  },
  quest_applicant_already_approved_bulk: {
    
      en: "One or more applicants belong to a quest that is already deposited. Status changes are not allowed.",
      ru: "Один или несколько заявителей принадлежат квесту, который уже внесен. Изменения статуса не разрешены.",
      uz: "Bir yoki bir nechta arizachi allaqachon depozitga qo'yilgan kvestga tegishli. Holat o'zgarishlari ruxsat etilmaydi.",
      hi: "एक या एक से अधिक आवेदक उस क्वेस्ट से संबंधित हैं जो पहले ही जमा हो चुका है। स्थिति परिवर्तन की अनुमति नहीं है।"
  },


  quest_already_closed: {
    
      en: "This quest is already closed and cannot be modified.",
      ru: "Этот квест уже закрыт и не может быть изменен.",
      uz: "Ushbu quest allaqachon yopilgan va o'zgartirib bo'lmaydi.",
      hi: "यह क्वेस्ट पहले ही बंद हो चुका है और संशोधित नहीं किया जा सकता।"
  },
  cannot_apply_to_own_quest: {
    
      en: "You cannot apply to your own quest.",
      ru: "Вы не можете подать заявку на свой собственный квест.",
      uz: "O'zingizning questingizga ariza bera olmaysiz.",
      hi: "आप अपने खुद के क्वेस्ट के लिए आवेदन नहीं कर सकते।"
  },
  quest_already_applied: {
    
      en: "You have already applied for this quest.",
      ru: "Вы уже подали заявку на этот квест.",
      uz: "Ushbu questga allaqachon ariza bergansiz.",
      hi: "आप इस क्वेस्ट के लिए पहले ही आवेदन कर चुके हैं।"
  },
  unable_to_delete_quest_after_approval: {
    
      en: "Unable to delete quest after it has been approved.",
      ru: "Невозможно удалить квест после его одобрения.",
      uz: "Quest tasdiqlangandan so'ng o'chirib bo'lmadi.",
      hi: "स्वीकृत होने के बाद क्वेस्ट हटाया नहीं जा सकता।"
  },
  unable_to_update_quest_after_approval: {
    
      en: "Unable to update quest after it has been approved.",
      ru: "Невозможно обновить квест после его одобрения.",
      uz: "Quest tasdiqlangandan so'ng yangilab bo'lmadi.",
      hi: "स्वीकृत होने के बाद क्वेस्ट अपडेट नहीं किया जा सकता।"
  },
  quest_already_exists: {
    
      en: "A quest with these details already exists.",
      ru: "Квест с такими деталями уже существует.",
      uz: "Ushbu tafsilotlar bilan quest allaqachon mavjud.",
      hi: "इन विवरणों के साथ एक क्वेस्ट पहले से ही मौजूद है।"
  },
  update_quest_applicants: {
    
      en: "Unable to update quest applicants. Please try again.",
      ru: "Не удалось обновить заявителей квеста. Пожалуйста, попробуйте снова.",
      uz: "Quest arizachilarini yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "क्वेस्ट आवेदकों को अपडेट नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  update_quest: {
    
      en: "Unable to update quest. Please try again.",
      ru: "Не удалось обновить квест. Пожалуйста, попробуйте снова.",
      uz: "Questni yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "क्वेस्ट अपडेट नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  quest_not_found: {
    
      en: "Quest not found. Please check the details and try again.",
      ru: "Квест не найден. Пожалуйста, проверьте детали и попробуйте снова.",
      uz: "Quest topilmadi. Iltimos, tafsilotlarni tekshirib yana urinib ko'ring.",
      hi: "क्वेस्ट नहीं मिला। कृपया विवरण जांचें और पुनः प्रयास करें।"
  },
  quest_not_authorized: {
    
      en: "You are not authorized to access this quest.",
      ru: "У вас нет прав для доступа к этому квесту.",
      uz: "Sizda ushbu questga kirishga ruxsat yo'q.",
      hi: "आपको इस क्वेस्ट तक पहुँचने की अनुमति नहीं है।"
  },
  create_quest: {
    
      en: "Unable to create quest. Please try again.",
      ru: "Не удалось создать квест. Пожалуйста, попробуйте снова.",
      uz: "Quest yaratib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "क्वेस्ट बनाया नहीं जा सका। कृपया पुनः प्रयास करें।"
  },
  quest_deleted: {
    
      en: "Unable to delete quest. Please try again.",
      ru: "Не удалось удалить квест. Пожалуйста, попробуйте снова.",
      uz: "Questni o'chirib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "क्वेस्ट हटाया नहीं जा सका। कृपया पुनः प्रयास करें।"
  },
  create_quest_applicants: {
    
      en: "Unable to create quest applicants. Please try again.",
      ru: "Не удалось создать заявителей квеста. Пожалуйста, попробуйте снова.",
      uz: "Quest arizachilarini yaratib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "क्वेस्ट आवेदक बनाए नहीं जा सके। कृपया पुनः प्रयास करें।"
  },
  quest_applicant_not_found: {
    
      en: "Quest applicant not found.",
      ru: "Заявитель квеста не найден.",
      uz: "Quest arizachisi topilmadi.",
      hi: "क्वेस्ट आवेदक नहीं मिला।"
  },
  quest_applicant_not_updated: {
    
      en: "Unable to update quest applicant. Please try again.",
      ru: "Не удалось обновить заявителя квеста. Пожалуйста, попробуйте снова.",
      uz: "Quest arizachisini yangilab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "क्वेस्ट आवेदक अपडेट नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  quest_applicant_approval: {
    
      en: "Unable to approve quest applicant. Please try again.",
      ru: "Не удалось одобрить заявителя квеста. Пожалуйста, попробуйте снова.",
      uz: "Quest arizachisini tasdiqlab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "क्वेस्ट आवेदक को स्वीकृत नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  // Authentication-related errors
  no_token: {
    
      en: "Authentication token is missing. Please log in.",
      ru: "Отсутствует токен аутентификации. Пожалуйста, войдите.",
      uz: "Autentifikatsiya tokeni yo'q. Iltimos, tizimga kiring.",
      hi: "प्रमाणीकरण टोकन गायब है। कृपया लॉगिन करें।"
  },
  jwt_expired: {
    
      en: "Your session has expired. Please log in again.",
      ru: "Ваша сессия истекла. Пожалуйста, войдите снова.",
      uz: "Sessiyangiz muddati tugadi. Iltimos, qayta tizimga kiring.",
      hi: "आपका सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।"
  },
  invalid_jwt: {
    
      en: "Invalid authentication token. Please log in again.",
      ru: "Недействительный токен аутентификации. Пожалуйста, войдите снова.",
      uz: "Noto'g'ri autentifikatsiya tokeni. Iltimos, qayta tizimga kiring.",
      hi: "अमान्य प्रमाणीकरण टोकन। कृपया पुनः लॉगिन करें।"
  },
  jwt_verification_error: {
    
      en: "There was an error verifying your authentication token.",
      ru: "Произошла ошибка при проверке вашего токена аутентификации.",
      uz: "Autentifikatsiya tokenini tekshirishda xatolik yuz berdi.",
      hi: "आपके प्रमाणीकरण टोकन को सत्यापित करने में त्रुटि हुई।"
  },
  invalid_refresh_token: {
    
      en: "Invalid refresh token. Please log in again.",
      ru: "Недействительный токен обновления. Пожалуйста, войдите снова.",
      uz: "Noto'g'ri refresh token. Iltimos, qayta tizimga kiring.",
      hi: "अमान्य रिफ्रेश टोकन। कृपया पुनः लॉगिन करें।"
  },
  refresh_token_expired: {
    
      en: "Your session has expired. Please log in again.",
      ru: "Ваша сессия истекла. Пожалуйста, войдите снова.",
      uz: "Sessiyangiz muddati tugadi. Iltimos, qayta tizimga kiring.",
      hi: "आपका सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।"
  },
  refresh_token_not_found: {
    
      en: "Refresh token not found. Please log in again.",
      ru: "Токен обновления не найден. Пожалуйста, войдите снова.",
      uz: "Refresh token topilmadi. Iltimos, qayta tizimga kiring.",
      hi: "रिफ्रेश टोकन नहीं मिला। कृपया पुनः लॉगिन करें।"
  },
  identifier_not_found: {
    
      en: "Identifier not found. Please check your details.",
      ru: "Идентификатор не найден. Пожалуйста, проверьте ваши данные.",
      uz: "Identifikator topilmadi. Iltimos, ma'lumotlaringizni tekshiring.",
      hi: "पहचानकर्ता नहीं मिला। कृपया अपनी जानकारी जांचें।"
  },
  // OTP-related errors
  otp_expired: {
    
      en: "The OTP has expired. Please request a new one.",
      ru: "OTP истек. Пожалуйста, запросите новый.",
      uz: "OTP muddati tugadi. Iltimos, yangisini so'rang.",
      hi: "OTP समाप्त हो गया है। कृपया नया अनुरोध करें।"
  },
  otp_not_match: {
    
      en: "The OTP entered is incorrect. Please try again.",
      ru: "Введенный OTP неверен. Пожалуйста, попробуйте снова.",
      uz: "Kiritilgan OTP noto'g'ri. Iltimos, yana urinib ko'ring.",
      hi: "दर्ज किया गया OTP गलत है। कृपया पुनः प्रयास करें।"
  },
  // Miscellaneous errors
  retry_signup: {
    
      en: "Signup failed. Please try again.",
      ru: "Регистрация не удалась. Пожалуйста, попробуйте снова.",
      uz: "Ro'yxatdan o'tish amalga oshmadi. Iltimos, yana urinib ko'ring.",
      hi: "साइनअप विफल रहा। कृपया पुनः प्रयास करें।"
  },
  retry_login: {
    
      en: "Authentication failed. Please log in again.",
      ru: "Аутентификация не удалась. Пожалуйста, войдите снова.",
      uz: "Autentifikatsiya amalga oshmadi. Iltimos, qayta tizimga kiring.",
      hi: "प्रमाणीकरण विफल रहा। कृपया पुनः लॉगिन करें।"
  },
  forget_password: {
    
      en: "Unable to send OTP for password reset. Please try again.",
      ru: "Не удалось отправить OTP для сброса пароля. Пожалуйста, попробуйте снова.",
      uz: "Parolni tiklash uchun OTP yuborib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "पासवर्ड रीसेट के लिए OTP नहीं भेजा जा सका। कृपया पुनः प्रयास करें।"
  },
  audio_reported: {
    
      en: "Unable to report this audio at the moment.",
      ru: "Не удалось пожаловаться на этот аудио в данный момент.",
      uz: "Ushbu audioga hozirda shikoyat qilib bo'lmadi.",
      hi: "इस समय इस ऑडियो की रिपोर्ट नहीं की जा सकी।"
  },
  audio_uploaded: {
    
      en: "Unable to upload audio. Please try again.",
      ru: "Не удалось загрузить аудио. Пожалуйста, попробуйте снова.",
      uz: "Audiolarni yuklab bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "ऑडियो अपलोड नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  create_audio: {
    
      en: "Unable to create audio. Please try again.",
      ru: "Не удалось создать аудио. Пожалуйста, попробуйте снова.",
      uz: "Audiolarni yaratib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "ऑडियो बनाया नहीं जा सका। कृपया पुनः प्रयास करें।"
  },
  create_songs: {
    
      en: "Unable to create songs. Please try again.",
      ru: "Не удалось создать песни. Пожалуйста, попробуйте снова.",
      uz: "Qo'shiqlarni yaratib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "गाने बनाए नहीं जा सके। कृपया पुनः प्रयास करें।"
  },
  song_not_found: {
    
      en: "Song not found.",
      ru: "Песня не найдена.",
      uz: "Qo'shiq topilmadi.",
      hi: "गाना नहीं मिला।"
  },
  max_applicants: {
    
      en: "The maximum number of applicants has been reached for this quest.",
      ru: "Достигнуто максимальное количество заявителей для этого квеста.",
      uz: "Ushbu quest uchun maksimal arizachilar soniga yetildi.",
      hi: "इस क्वेस्ट के लिए अधिकतम आवेदकों की संख्या पहुँच गई है।"
  },
  notification: {
    
      en: "Unable to retrieve notifications at this time.",
      ru: "Не удалось получить уведомления в данный момент.",
      uz: "Bildirishnomalarni hozirda olishda xatolik.",
      hi: "इस समय सूचनाएं प्राप्त नहीं की जा सकीं।"
  },
  share_post: {
    
      en: "Unable to share post. Please try again.",
      ru: "Не удалось поделиться постом. Пожалуйста, попробуйте снова.",
      uz: "Postni ulashib bo'lmadi. Iltimos, yana urinib ko'ring.",
      hi: "पोस्ट साझा नहीं किया जा सका। कृपया पुनः प्रयास करें।"
  },
  validation: {
    success: false,
  },
  catch_error: {
    
      en: "An unexpected error occurred. Please try again later.",
      ru: "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.",
      uz: "Kutilmagan xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.",
      hi: "एक अप्रत्याशित त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।"
  },
  unable_to_create_signedURL: {
    
      en: "Unable to generate a signed URL at this time.",
      ru: "Не удалось создать подписанный URL в данный момент.",
      uz: "Imzolangan URL yaratib bo'lmadi.",
      hi: "इस समय साइन किया गया URL उत्पन्न नहीं किया जा सका।"
  },
  cannot_rerunIt: {
      en: "This operation cannot be repeated. Please contact support if you need assistance.",
      ru: "Эту операцию нельзя повторить. Пожалуйста, обратитесь в поддержку, если нужна помощь.",
      uz: "Ushbu amalni takrorlab bo'lmaydi. Yordam kerak bo'lsa, texnik yordamga murojaat qiling.",
      hi: "इस क्रिया को दोहराया नहीं जा सकता। सहायता के लिए कृपया समर्थन से संपर्क करें।"
  },

  // Notification-related errors
    notification_deleted: {
      en: "Notification deleted successfully.",
      ru: "Уведомление успешно удалено.",
      uz: "Bildirishnoma muvaffaqiyatli o'chirildi.",
      hi: "सूचना सफलतापूर्वक हटा दी गई।"
  }
};

export const success = {
    // Notification-related success
    notification_deleted: {
        en: "Notification deleted successfully.",
        ru: "Уведомление успешно удалено.",
        uz: "Bildirishnoma muvaffaqiyatli o'chirildi.",
        hi: "सूचना सफलतापूर्वक हटा दी गई।"
    },

  // Referral Code
  referral_code_applied: {
    
      en: "Referral code applied successfully. Welcome to the community!",
      ru: "Реферальный код успешно применен. Добро пожаловать в сообщество!",
      uz: "Referal kod muvaffaqiyatli qo'llandi. Jamiyatga xush kelibsiz!",
      hi: "रेफरल कोड सफलतापूर्वक लागू किया गया। समुदाय में आपका स्वागत है!"
  },
  // Two-Factor Authentication
  two_factor_code_sent: {
    
      en: "A verification code has been sent to your device for two-factor authentication.",
      ru: "Код подтверждения отправлен на ваше устройство для двухфакторной аутентификации.",
      uz: "Ikki faktorli autentifikatsiya uchun tasdiqlash kodi qurilmangizga yuborildi.",
      hi: "दो-कारक प्रमाणीकरण के लिए एक सत्यापन कोड आपके डिवाइस पर भेजा गया है।"
  },
  // Feature-reported-issues 
  create_feature_issue: {
    
      en: "Thank you for your feedback. Your feature request has been submitted successfully.",
      ru: "Спасибо за ваш отзыв. Ваш запрос на функцию успешно отправлен.",
      uz: "Fikringiz uchun rahmat. Funktsiya so'rovingiz muvaffaqiyatli yuborildi.",
      hi: "आपकी प्रतिक्रिया के लिए धन्यवाद। आपकी फीचर अनुरोध सफलतापूर्वक सबमिट कर दी गई है।"
  },
  // Delete Account
  delete_account: {
    
      en: "Your account has been deleted. We're sorry to see you go.",
      ru: "Ваш аккаунт был удален. Нам жаль, что вы уходите.",
      uz: "Akkauntingiz o'chirildi. Ketayotganingizdan afsusdamiz.",
      hi: "आपका खाता हटा दिया गया है। आपको जाते देख हमें खेद है।"
  },
  // Deactivate Account
  deactivate_account: {
    
      en: "Your account has been deactivated. You can reactivate it anytime by logging in.",
      ru: "Ваш аккаунт был деактивирован. Вы можете восстановить его в любое время, войдя в систему.",
      uz: "Akkauntingiz o'chirildi. Istalgan vaqtda tizimga kirib faollashtirishingiz mumkin.",
      hi: "आपका खाता निष्क्रिय कर दिया गया है। आप कभी भी लॉगिन करके इसे पुनः सक्रिय कर सकते हैं।"
  },
  // Search-related success
  search_history_created: {
    
      en: "Your search history has been saved successfully.",
      ru: "Ваша история поиска успешно сохранена.",
      uz: "Qidiruv tarixingiz muvaffaqiyatli saqlandi.",
      hi: "आपका खोज इतिहास सफलतापूर्वक सहेजा गया है।"
  },
  search_history_deleted: {
    
      en: "Your search history has been deleted.",
      ru: "Ваша история поиска удалена.",
      uz: "Qidiruv tarixingiz o'chirildi.",
      hi: "आपका खोज इतिहास हटा दिया गया है।"
  },
  search_history_updated: {
    
      en: "Your search history has been updated.",
      ru: "Ваша история поиска обновлена.",
      uz: "Qidiruv tarixingiz yangilandi.",
      hi: "आपका खोज इतिहास अपडेट कर दिया गया है।"
  },
  // Bio-links related-success
  update_biolink: {
    
      en: "Your bio-link has been updated successfully.",
      ru: "Ваша биоссылка успешно обновлена.",
      uz: "Bio-linkingiz muvaffaqiyatli yangilandi.",
      hi: "आपका बायो-लिंक सफलतापूर्वक अपडेट किया गया है।"
  },
  create_biolink: {
    
      en: "Your bio-link has been created successfully.",
      ru: "Ваша биоссылка успешно создана.",
      uz: "Bio-linkingiz muvaffaqiyatli yaratildi.",
      hi: "आपका बायो-लिंक सफलतापूर्वक बनाया गया है।"
  },
  delete_biolink: {
    
      en: "Your bio-link has been deleted.",
      ru: "Ваша биоссылка удалена.",
      uz: "Bio-linkingiz o'chirildi.",
      hi: "आपका बायो-लिंक हटा दिया गया है।"
  },
  // Two-factor authentication-related success
  update_two_factor: {
    
      en: "Two-factor authentication settings updated successfully.",
      ru: "Настройки двухфакторной аутентификации успешно обновлены.",
      uz: "Ikki faktorli autentifikatsiya sozlamalari muvaffaqiyatli yangilandi.",
      hi: "दो-कारक प्रमाणीकरण सेटिंग्स सफलतापूर्वक अपडेट की गईं।"
  },
  // Notification-related success
  update_notification_setting: {
    
      en: "Your notification settings have been updated.",
      ru: "Ваши настройки уведомлений обновлены.",
      uz: "Bildirishnoma sozlamalaringiz yangilandi.",
      hi: "आपकी सूचना सेटिंग्स अपडेट कर दी गई हैं।"
  },
  // Profile-related success
  profile_image_deleted: {
    
      en: "Your profile image has been deleted.",
      ru: "Ваше изображение профиля удалено.",
      uz: "Profil rasmingiz o'chirildi.",
      hi: "आपकी प्रोफ़ाइल छवि हटा दी गई है।"
  },
  profile_updated: {
    
      en: "Your profile has been updated successfully.",
      ru: "Ваш профиль успешно обновлен.",
      uz: "Profilingiz muvaffaqiyatli yangilandi.",
      hi: "आपकी प्रोफ़ाइल सफलतापूर्वक अपडेट की गई है।"
  },
  // Password-related success
  password_updated: {
    
      en: "Your password has been changed successfully.",
      ru: "Ваш пароль успешно изменен.",
      uz: "Parolingiz muvaffaqiyatli o'zgartirildi.",
      hi: "आपका पासवर्ड सफलतापूर्वक बदल दिया गया है।"
  },
  // User-related success
  account_created: {
    
      en: "Your account has been created. Welcome aboard!",
      ru: "Ваш аккаунт создан. Добро пожаловать!",
      uz: "Akkauntingiz yaratildi. Xush kelibsiz!",
      hi: "आपका खाता बनाया गया है। स्वागत है!"
  },
  user_followed: {
    
      en: "You are now following this user.",
      ru: "Вы теперь подписаны на этого пользователя.",
      uz: "Siz ushbu foydalanuvchini kuzatyapsiz.",
      hi: "अब आप इस उपयोगकर्ता को फॉलो कर रहे हैं।"
  },
  user_unfollowed: {
    
      en: "You have unfollowed this user.",
      ru: "Вы отписались от этого пользователя.",
      uz: "Siz ushbu foydalanuvchini kuzatishni to'xtatdingiz.",
      hi: "आपने इस उपयोगकर्ता को अनफॉलो कर दिया है।"
  },
  follower_removed: {
    
      en: "The follower has been removed from your list.",
      ru: "Подписчик был удален из вашего списка.",
      uz: "Kuzatuvchi ro'yxatingizdan o'chirildi.",
      hi: "फॉलोवर आपकी सूची से हटा दिया गया है।"
  },
  user_reported: {
    
      en: "Thank you for reporting. We will review this user promptly.",
      ru: "Спасибо за жалобу. Мы оперативно рассмотрим этого пользователя.",
      uz: "Shikoyatingiz uchun rahmat. Ushbu foydalanuvchini tezda ko'rib chiqamiz.",
      hi: "रिपोर्ट करने के लिए धन्यवाद। हम इस उपयोगकर्ता की शीघ्र समीक्षा करेंगे।"
  },
  ai_content_reported: {
    
      en: "Thank you for reporting the AI content. We will review it promptly.",
      ru: "Спасибо за жалобу на AI-контент. Мы оперативно рассмотрим его.",
      uz: "AI kontentni shikoyat qilganingiz uchun rahmat. Tezda ko'rib chiqamiz.",
      hi: "AI सामग्री की रिपोर्ट करने के लिए धन्यवाद। हम शीघ्र समीक्षा करेंगे।"
  },
  // Session-related success
  session_deleted: {
    
      en: "You have been logged out successfully.",
      ru: "Вы успешно вышли из системы.",
      uz: "Tizimdan muvaffaqiyatli chiqdingiz.",
      hi: "आप सफलतापूर्वक लॉग आउट हो गए हैं।"
  },
  // Flick-related success
  flick_reposted: {
    
      en: "Flick reposted successfully. Share your favorite moments!",
      ru: "Флик успешно репостнут. Делитесь любимыми моментами!",
      uz: "Flick muvaffaqiyatli repost qilindi. Sevimli lahzalaringizni ulashing!",
      hi: "फ्लिक सफलतापूर्वक रीपोस्ट किया गया। अपने पसंदीदा पल साझा करें!"
  },
  flick_uploaded: {
    
      en: "Your flick has been uploaded successfully.",
      ru: "Ваш флик успешно загружен.",
      uz: "Flickingiz muvaffaqiyatli yuklandi.",
      hi: "आपका फ्लिक सफलतापूर्वक अपलोड किया गया है।"
  },
  flick_created: {
    
      en: "Your flick has been created successfully.",
      ru: "Ваш флик успешно создан.",
      uz: "Flickingiz muvaffaqiyatli yaratildi.",
      hi: "आपका फ्लिक सफलतापूर्वक बनाया गया है।"
  },
  flick_updated: {
    
      en: "Your flick has been updated.",
      ru: "Ваш флик обновлен.",
      uz: "Flickingiz yangilandi.",
      hi: "आपका फ्लिक अपडेट कर दिया गया है।"
  },
  flick_deleted: {
    
      en: "Your flick has been deleted.",
      ru: "Ваш флик удален.",
      uz: "Flickingiz o'chirildi.",
      hi: "आपका फ्लिक हटा दिया गया है।"
  },
  flick_reported: {
    
      en: "Thank you for reporting. We will review this flick.",
      ru: "Спасибо за жалобу. Мы рассмотрим этот флик.",
      uz: "Shikoyatingiz uchun rahmat. Ushbu flickni ko'rib chiqamiz.",
      hi: "रिपोर्ट करने के लिए धन्यवाद। हम इस फ्लिक की समीक्षा करेंगे।"
  },
  toggle_like: {
    
      en: "Your like status has been updated.",
      ru: "Ваш статус лайка обновлен.",
      uz: "Like holatingiz yangilandi.",
      hi: "आपकी लाइक स्थिति अपडेट कर दी गई है।"
  },
  status_changed_flicked: {
    
      en: "Flick status changed successfully.",
      ru: "Статус флика успешно изменен.",
      uz: "Flick holati muvaffaqiyatli o'zgartirildi.",
      hi: "फ्लिक स्थिति सफलतापूर्वक बदल दी गई है।"
  },
  // Story-related success
  story_uploaded: {
    
      en: "Your story has been uploaded successfully.",
      ru: "Ваша история успешно загружена.",
      uz: "Hikoyangiz muvaffaqiyatli yuklandi.",
      hi: "आपकी कहानी सफलतापूर्वक अपलोड की गई है।"
  },
  story_deleted: {
    
      en: "Your story has been deleted.",
      ru: "Ваша история удалена.",
      uz: "Hikoyangiz o'chirildi.",
      hi: "आपकी कहानी हटा दी गई है।"
  },
  story_reported: {
    
      en: "Thank you for reporting. We will review this story.",
      ru: "Спасибо за жалобу. Мы рассмотрим эту историю.",
      uz: "Shikoyatingiz uchun rahmat. Ushbu hikoyani ko'rib chiqamiz.",
      hi: "रिपोर्ट करने के लिए धन्यवाद। हम इस कहानी की समीक्षा करेंगे।"
  },
  add_story_viewer: {
    
      en: "Viewer added to your story.",
      ru: "Зритель добавлен к вашей истории.",
      uz: "Tomoshabin hikoyangizga qo'shildi.",
      hi: "दर्शक आपकी कहानी में जोड़ दिया गया है।"
  },
  // Comment-related success
  comment_deleted: {
    
      en: "Your comment has been deleted.",
      ru: "Ваш комментарий удален.",
      uz: "Izohingiz o'chirildi.",
      hi: "आपकी टिप्पणी हटा दी गई है।"
  },
  create_comment: {
    
      en: "Your comment has been posted.",
      ru: "Ваш комментарий опубликован.",
      uz: "Izohingiz joylandi.",
      hi: "आपकी टिप्पणी पोस्ट कर दी गई है।"
  },
  update_comment: {
    
      en: "Your comment has been updated.",
      ru: "Ваш комментарий обновлен.",
      uz: "Izohingiz yangilandi.",
      hi: "आपकी टिप्पणी अपडेट कर दी गई है।"
  },
  comment_reported: {
    
      en: "Thank you for reporting. We will review this comment.",
      ru: "Спасибо за жалобу. Мы рассмотрим этот комментарий.",
      uz: "Shikoyatingiz uchun rahmat. Ushbu izohni ko'rib chiqamiz.",
      hi: "रिपोर्ट करने के लिए धन्यवाद। हम इस टिप्पणी की समीक्षा करेंगे।"
  },
  // Feedback-related success
  update_feedback: {
    
      en: "Your feedback has been updated. Thank you for helping us improve.",
      ru: "Ваш отзыв обновлен. Спасибо за помощь в улучшении.",
      uz: "Fikr-mulohazangiz yangilandi. Yaxshilashga yordam berganingiz uchun rahmat.",
      hi: "आपकी प्रतिक्रिया अपडेट कर दी गई है। सुधार में मदद के लिए धन्यवाद।"
  },
  delete_feedback: {
    
      en: "Your feedback has been deleted.",
      ru: "Ваш отзыв удален.",
      uz: "Fikr-mulohazangiz o'chirildi.",
      hi: "आपकी प्रतिक्रिया हटा दी गई है।"
  },
  create_feedback: {
    
      en: "Thank you for your feedback. We appreciate your input.",
      ru: "Спасибо за ваш отзыв. Мы ценим ваш вклад.",
      uz: "Fikringiz uchun rahmat. Sizning fikringiz biz uchun muhim.",
      hi: "आपकी प्रतिक्रिया के लिए धन्यवाद। हम आपके इनपुट की सराहना करते हैं।"
  },
  // Theme Setting
  update_theme: {
    
      en: "Your theme settings have been updated.",
      ru: "Ваши настройки темы обновлены.",
      uz: "Mavzu sozlamalaringiz yangilandi.",
      hi: "आपकी थीम सेटिंग्स अपडेट कर दी गई हैं।"
  },
  // Quest-related success
  qr_verified_success: {
    
      en: "QR code verified successfully. You may proceed.",
      ru: "QR-код успешно подтвержден. Можете продолжать.",
      uz: "QR kod muvaffaqiyatli tasdiqlandi. Davom etishingiz mumkin.",
      hi: "QR कोड सफलतापूर्वक सत्यापित किया गया। आप आगे बढ़ सकते हैं।"
  },
  quest_status_closed: {
    
      en: "The quest has been closed successfully.",
      ru: "Квест успешно закрыт.",
      uz: "Quest muvaffaqiyatli yopildi.",
      hi: "क्वेस्ट सफलतापूर्वक बंद कर दिया गया है।"
  },
  quest_created: {
    
      en: "Your quest has been created successfully.",
      ru: "Ваш квест успешно создан.",
      uz: "Questingiz muvaffaqiyatli yaratildi.",
      hi: "आपका क्वेस्ट सफलतापूर्वक बनाया गया है।"
  },
  update_quest: {
    
      en: "Your quest has been updated.",
      ru: "Ваш квест обновлен.",
      uz: "Questingiz yangilandi.",
      hi: "आपका क्वेस्ट अपडेट कर दिया गया है।"
  },
  quest_deleted: {
    
      en: "Your quest has been deleted.",
      ru: "Ваш квест удален.",
      uz: "Questingiz o'chirildi.",
      hi: "आपका क्वेस्ट हटा दिया गया है।"
  },
  quest_applicant_approved: {
    en: "Quest applicant approved successfully.",
    ru: "Заявитель квеста успешно одобрен.",
    uz: "Quest arizachisi muvaffaqiyatli tasdiqlandi.",
    hi: "क्वेस्ट आवेदक सफलतापूर्वक स्वीकृत किया गया है।"
  },
  create_quest_applicants: {
    
      en: "Quest applicants have been added successfully.",
      ru: "Заявители квеста успешно добавлены.",
      uz: "Quest arizachilari muvaffaqiyatli qo'shildi.",
      hi: "क्वेस्ट आवेदक सफलतापूर्वक जोड़ दिए गए हैं।"
  },
  quest_applicant_updated: {
    
      en: "Quest applicant updated successfully.",
      ru: "Заявитель квеста успешно обновлен.",
      uz: "Quest arizachisi muvaffaqiyatli yangilandi.",
      hi: "क्वेस्ट आवेदक सफलतापूर्वक अपडेट किया गया है।"
  },
  // Authentication-related success
  login: {
    
      en: "Login successful. Welcome back!",
      ru: "Вход выполнен успешно. С возвращением!",
      uz: "Kirish muvaffaqiyatli. Qaytib kelganingizdan xursandmiz!",
      hi: "लॉगिन सफल रहा। फिर से स्वागत है!"
  },
  logout: {
    
      en: "You have been logged out. See you again soon!",
      ru: "Вы вышли из системы. До скорой встречи!",
      uz: "Tizimdan chiqdingiz. Tez orada ko'rishamiz!",
      hi: "आप लॉग आउट हो गए हैं। फिर मिलेंगे!"
  },
  verify_otp: {
    
      en: "OTP verified successfully. You may continue.",
      ru: "OTP успешно подтвержден. Можете продолжать.",
      uz: "OTP muvaffaqiyatli tasdiqlandi. Davom etishingiz mumkin.",
      hi: "OTP सफलतापूर्वक सत्यापित किया गया। आप आगे बढ़ सकते हैं।"
  },
  otp_sent: {
    
      en: "A one-time password has been sent to your device.",
      ru: "Одноразовый пароль отправлен на ваше устройство.",
      uz: "Bir martalik parol qurilmangizga yuborildi.",
      hi: "एक बार का पासवर्ड आपके डिवाइस पर भेजा गया है।"
  },
  username_available: {
    
      en: "This username is available.",
      ru: "Это имя пользователя доступно.",
      uz: "Bu foydalanuvchi nomi mavjud.",
      hi: "यह उपयोगकर्ता नाम उपलब्ध है।"
  },
  email_available: {
    
      en: "This email address is available.",
      ru: "Этот адрес электронной почты доступен.",
      uz: "Bu elektron pochta manzili mavjud.",
      hi: "यह ईमेल पता उपलब्ध है।"
  },
  phone_available: {
    
      en: "This phone number is available.",
      ru: "Этот номер телефона доступен.",
      uz: "Bu telefon raqami mavjud.",
      hi: "यह फ़ोन नंबर उपलब्ध है।"
  },
  // Miscellaneous success
  share_post: {
    
      en: "Your post has been shared successfully.",
      ru: "Ваш пост успешно опубликован.",
      uz: "Postingiz muvaffaqiyatli ulashildi.",
      hi: "आपका पोस्ट सफलतापूर्वक साझा किया गया है।"
  },
  song_uploaded: {
    
      en: "Your song has been uploaded successfully.",
      ru: "Ваша песня успешно загружена.",
      uz: "Qo'shig'ingiz muvaffaqiyatli yuklandi.",
      hi: "आपका गाना सफलतापूर्वक अपलोड किया गया है।"
  },
  audio_reported: {
    
      en: "Thank you for reporting. We will review this audio.",
      ru: "Спасибо за жалобу. Мы рассмотрим этот аудио.",
      uz: "Shikoyatingiz uchun rahmat. Ushbu audiolarni ko'rib chiqamiz.",
      hi: "रिपोर्ट करने के लिए धन्यवाद। हम इस ऑडियो की समीक्षा करेंगे।"
  },
};