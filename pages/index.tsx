import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import CuteGradientCircle from "../components/CuteGradientCircle";
import SignInButton from "../components/SignInButton";
import { UserModel } from "../models/User";
import dbConnect from "../utils/dbConnect";

export default function Home() {

    const hosaTinder = "HOSA TINDER ".repeat(100)

    return (
        // <div className= font>
        <div className="top-0 left-0 absolute w-screen h-screen overflow-hidden">
            <div className="hidden sm:block oswald font-bold truncate text-4xl">
                <div className="absolute top-0 right-0" style={{ transform: "rotate(180deg)" }}>
                    <p style={{ transform: "rotate(-90deg)", transformOrigin: "0% 0%" }}>{hosaTinder}</p>
                </div>
                <p className="absolute left-3 pl-8">{hosaTinder}</p>
                <p className="absolute right-3 bottom-0 pl-8" style={{ transform: "rotate(180deg)" }}>{hosaTinder}</p>
                <p className="absolute bottom-0 left-0" style={{ transform: "rotate(-90deg)", transformOrigin: "0% 0%" }}>{hosaTinder}</p>
            </div>

            <CuteGradientCircle className="w-96 h-96 absolute rounded-full" style={{left: -40, top: -40}}/>
            <CuteGradientCircle className="w-96 h-96 absolute rounded-full" style={{right: -40, bottom: -40}}/>

            <div className="flex items-center justify-center text-center flex-col h-screen work-sans">
                <div style={{maxWidth: "70%"}}>                    
                    <p className="sm:text-7xl text-5xl font-bold">Welcome to HOSA Tinder</p>
                    <p className="sm:text-4xl text-2xl py-6 text-gray-700 font-normal">Find your perfect event.</p>
                </div>
                <div className="p-2"></div>
                <div className="flex flex-row rounded-full montserrat text-3xl p-5" style={{ color: "rgba(255,255,255,1)", background: "rgba(0,0,0,1)" }}>
                    <SignInButton />
                </div>  
            </div>
        </div>
    );
}

{/* <HandwrittenButton onClick={() => console.log("button is pressed!")}>
                Sign-up 
                </HandwrittenButton> */}

{/* textShadowColor: "black", textShadowOffset: {width: 10, height: 10}, textShadowRadius: 10 */}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) return {props: {}};

    try {
        await dbConnect();
        const thisUser = await UserModel.findOne({email: session.user.email});
        return {redirect: {permanent: false, destination: thisUser ? "app" : "/auth/newaccount"}};
    } catch (e) {
        console.log(e);
        return {notFound: true};
    }
};