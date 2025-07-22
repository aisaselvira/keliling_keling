import React from "react";
import {signIn} from "next-auth/react";

const SocialSignIn = () => {
    const handleGoogleSignIn = async () => {
        try {
            await signIn("google");
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };
    const handleGithubSignIn = async () => {
        try {
            await signIn("github");
        } catch (error) {
            console.error("Error signing in with GitHub:", error);
        }
    };

    return (
        <div className="flex gap-4">
            <button onClick={handleGoogleSignIn} className="...">
                Sign In
                {/* SVG Google */}
            </button>
            <button onClick={handleGithubSignIn} className="...">
                Sign In
                {/* SVG GitHub */}
            </button>
        </div>
    );
};

export default SocialSignIn;
