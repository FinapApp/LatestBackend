import { bioLinkRoutes } from "./bioLink/bioLink..routes";
import { commentRoutes } from "./comment/comment.routes";
import { feedbackRoutes } from "./feedback/feedback.routes";
import { flickRoutes } from "./flicks/protected-flicks.routes";
import { followRoutes } from "./follow/follow.routes";
import { friendSuggestionRoutes } from "./friendSuggestion/friendSuggestion.routes";
import { likeRoutes } from "./like/like.routes";
import { questRoutes } from "./quest/quest.routes";
import { reportRoutes } from "./report/report.routes";
import { searchRoutes } from "./search/search.routes";
import { settingNotificationRoutes } from "./setting/settingNotification.routes";
import { settingProfile } from "./setting/settingProfile.routes";
import { settingSessionRoutes } from "./setting/settingSession.routes";
import { settingThemeRoutes } from "./setting/settingTheme.routes";
import { settingTwoFactorRoutes } from "./setting/settingTwoFactor.routes";
import { storyRoutes } from "./stories/story.routes";
import { walletRoutes } from "./wallet/wallet.routes";


const routes = [
    flickRoutes,
    walletRoutes,
    commentRoutes,
    reportRoutes,
    storyRoutes,
    followRoutes,
    likeRoutes,
    questRoutes,
    settingProfile,
    settingNotificationRoutes,
    feedbackRoutes,
    friendSuggestionRoutes,
    settingSessionRoutes,
    settingThemeRoutes,
    settingTwoFactorRoutes,
    bioLinkRoutes,
    searchRoutes
];

export default routes;
