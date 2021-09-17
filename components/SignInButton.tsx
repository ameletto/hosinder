import { signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { FaGoogle } from "react-icons/fa";
import HandwrittenButton from "./HandwrittenButton";

export default function SignInButton() {
    const router = useRouter();
    return (
        <HandwrittenButton onClick={() => signIn("google")}>
            <div className="flex items-center">
                <FaGoogle/><span className="ml-2">Sign in</span>
            </div>
        </HandwrittenButton>
    );
}