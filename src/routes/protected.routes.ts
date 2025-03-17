import { commentRoutes } from "./comment/comment.routes";
import { flickRoutes } from "./flicks/protected-flicks.routes";
import { followRoutes } from "./follow/follow.routes";
import { likeRoutes } from "./like/like.routes";
import { questRoutes } from "./quest/quest.routes";
import { reportRoutes } from "./report/report.routes";
import { settingNotificationRoutes } from "./setting/settingNotification.routes";
import { settingProfile } from "./setting/settingProfile.routes";
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
    settingNotificationRoutes
];

export default routes;
