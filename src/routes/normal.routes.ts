import { authRoutes } from "./auth/auth.routes";
import { commentRoutes } from "./comment/comment.routes";
import { onboardingRoutes } from "./onboarding/onboarding.routes";
import { flickRoutes } from "./flicks/unprotected-flicks.routes";


const routes = [
    authRoutes,
    onboardingRoutes,
    flickRoutes,
];

export default routes;
