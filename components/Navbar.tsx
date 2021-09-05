import { useSession } from "next-auth/client";
import Button from "./Button";
import Container from "./Container";

export default function Navbar() {
    const [session, loading] = useSession();

    return (
        <div className="w-full sticky top-0">
            <Container className="flex items-center my-4" width="full">
                <p className="oswald font-bold text-4xl">HOSA Tinder</p>
                <div className="ml-auto">
                    {loading ? <p>Loading...</p> : session ? (
                        <img
                            src={session.user.image}
                            alt={`Profile picture of ${session.user.name}`}
                            className="w-8 h-8 rounded-full"
                        />
                    ) : (
                        <Button href="/auth/welcome">Sign in</Button>
                    )}
                </div>
            </Container>
        </div>
    );
}