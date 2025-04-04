import { authRoutes } from "./auth/auth.routes";
import { onboardingRoutes } from "./onboarding/onboarding.routes";
import { flickRoutes } from "./flicks/unprotected-flicks.routes";
import { forgetPasswordRoutes } from "./forget-password/forgetPassword.routes";
import { commonRoutes } from "./common/common.routes";


const routes = [
    authRoutes,
    forgetPasswordRoutes,
    onboardingRoutes,
    flickRoutes,
    commonRoutes
];

export default routes;
