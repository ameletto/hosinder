import { useSession, signOut } from "next-auth/client";
import Button from "./Button";
import Container from "./Container";
import HandwrittenButton from "./HandwrittenButton";
import Link from "next/link";

export default function Navbar() {
    const [session, loading] = useSession();

    return (
        <div className="w-full sticky top-0">
            <Container className="flex items-center my-4" width="full">
                <Link href="/"><a><img src="/logo.png" alt="HOSA Tinder logo" className="h-12"/></a></Link>
                <div className="ml-auto flex items-center">
                    {loading ? <p>Loading...</p> : session ? (
                        <>
                        <HandwrittenButton onClick={() => signOut()}>Sign out</HandwrittenButton>
                        <img
                            src={session.user.image}
                            alt={`Profile picture of ${session.user.name}`}
                            className="w-10 h-10 rounded-full"
                        />
                        </>
                    ) : (
                        <Button href="/auth/welcome">Sign in</Button>
                    )}
                </div>
            </Container>
        </div>
    );
}