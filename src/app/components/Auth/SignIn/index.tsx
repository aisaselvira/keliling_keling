"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import SocialSignIn from "../SocialBTN/SocialSignIn";
import Logo from "@/app/components/Layout/Header/Logo";
import Loader from "@/app/components/Common/Loader";
import Error from "next/error";
import Cookies from "js-cookie";

type SigninProps = {
    onSuccess?: (userData: {name: string}) => void;
}
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

const Signin: React.FC<SigninProps> = ({onSuccess}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const validateForm = () => {
        let errors = {username: "", password: ""};
        let isValid = true;

        if (!loginData.username) {
            errors.username = "Email is required.";
            isValid = false;
        }

        if (!loginData.password) {
            errors.password = "Password is required.";
            isValid = false;
        } else if (loginData.password.length < 8) {
            errors.password = "Password must be at least 8 characters long.";
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username: loginData.username, password: loginData.password}),
                credentials: "include",
            })
            const data = await res.json()

            Cookies.set("token", data.token, { expires: 1, path: "/" })

            if(!res.ok) {
                throw new Error(data.message || "Login failed")
            }

            const profileRes = await fetch(`${baseUrl}/api/user/me`, {
                credentials: "include",
            })
            const profile = await profileRes.json()

            if (profile.role === "admin") {
                const userData = { name: profile.name || loginData.username };
                localStorage.setItem("user", JSON.stringify({ user: userData.name }));
                onSuccess?.(userData); // Trigger Header update
                router.push("/admin");
            } else {
              alert("Anda bukan admin")
            }

        } catch (error) {
            alert("Something went wrong. Please try again.");
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-10 text-center mx-auto inline-block">
                <Logo />
            </div>

            <SocialSignIn />

            <span className="z-1 relative my-8 block text-center">
                <span className="-z-1 absolute left-0 top-1/2 block h-px w-full bg-border dark:bg-dark_border"></span>
                <span className="text-muted dark:text-white/60 relative z-10 inline-block bg-white px-3 text-base dark:bg-darklight">
                    OR
                </span>
            </span>

            <form onSubmit={handleSubmit}>
                <div className="mb-[22px]">
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                        className="w-full rounded-md border placeholder:text-gray-400  border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mb-[22px]">
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mb-9">
                    <button
                        type="submit"
                        className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary hover:bg-primary/75 dark:hover:bg-darkprimary! px-5 py-3 text-base text-white font-medium transition duration-300 ease-in-out"
                    >
                        Sign In
                        {loading && <Loader />}
                    </button>
                </div>
            </form>
            <div className="flex flex-col items-center justify-center">
                <Link
                    href="/forgot-password"
                    className="mb-2 inline-block text-base text-dark hover:text-primary dark:text-white dark:hover:text-primary"
                >
                    Forget Password?
                </Link>
            </div>
        </div>
    );
};

export default Signin;
