import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);
const isOnboarding = createRouteMatcher(['/onboarding']);
// Stripe webhooks must never be blocked by auth
const isWebhook = createRouteMatcher(['/api/webhooks(.*)']);

export default clerkMiddleware(async (auth, req) => {
    if (isPublicRoute(req) || isWebhook(req)) return;

    const { userId, orgId, redirectToSignIn } = await auth();

    if (!userId) {
        return redirectToSignIn();
    }

    // Signed in but no org yet → force onboarding (skip if already there)
    if (!orgId && !isOnboarding(req)) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
