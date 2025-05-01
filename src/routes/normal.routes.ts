import { authRoutes } from "./auth/auth.routes";
import { onboardingRoutes } from "./onboarding/onboarding.routes";
import { flickRoutes } from "./flicks/unprotected-flicks.routes";
import { forgetPasswordRoutes } from "./forget-password/forgetPassword.routes";
import { commonRoutes } from "./common/common.routes";
import { unprotectedProfileRoutes } from "./profile/unprotectedProfile.routes";
import { songRoutes } from "./song/song.routes";


const routes = [
    authRoutes,
    forgetPasswordRoutes,
    onboardingRoutes,
    flickRoutes,
    commonRoutes,
    unprotectedProfileRoutes,
    songRoutes
];

export default routes;
