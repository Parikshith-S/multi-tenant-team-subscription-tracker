import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protect all dashboard routes
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        // 1. Await the auth() call to get user data
        const { userId, redirectToSignIn } = await auth();

        // 2. Manually check if user is signed in
        if (!userId) {
            return redirectToSignIn();
        }
    }
});


export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};