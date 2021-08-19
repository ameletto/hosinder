import SignInButton from "../components/SignInButton"

export default function Home() {

    return (
        // <div className= font>
        <div>
            <p className="absolute left-3 truncate z-10 oswald font-bold" style={{ fontSize: 36 }}> HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA</p>
            <p className="absolute truncate z-10 oswald font-bold" style={{ transform: "rotate(90deg)", fontSize: 36 , top: 393, left: 1062}}> TINDER HOSA TINDER HOSA TINDER HOSA TINDER HO </p>
            <p className="absolute right-3 truncate bottom-0 z-10 oswald font-bold" style={{ transform: "rotate(180deg)", fontSize: 36 }}> SA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TI</p>
            <p className="absolute truncate z-10 oswald font-bold" style={{ transform: "rotate(270deg)", fontSize: 36, bottom: 340, right: 1056}}> NDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA</p>

            <div className="absolute w-96 h-96 rounded-full z-0" style={{ background: "radial-gradient(rgba(183,225,252,1) 30%, rgba(212,208,254,0.5) 60%, rgba(255,255,255,0) 100%)", left: -40, top: -40}}>
            </div>
            
            <div className="absolute w-96 h-96 rounded-full right-0 bottom-0 z-0" style={{ background: "radial-gradient(rgba(183,225,252,1) 30%, rgba(212,208,254,0.5) 60%, rgba(255,255,255,0) 100%)", right: -40, bottom: -40}}>
            </div>

            <div className="flex items-center justify-center flex-col h-screen work-sans font-bold">
                <p className="text-7xl z-10">Welcome to HOSA Tinder</p>
                <p className="text-5xl z-10 p-3">Find your perfect event.</p>
                <div className="p-2"></div>
                <div className="flex flex-row rounded-full montserrat text-3xl p-5" style={{ color: "rgba(255,255,255,1)", background: "rgba(0,0,0,1)" }}>
                    <SignInButton z-10/>
                </div>  
            </div>
        </div>
    );
}

{/* <HandwrittenButton onClick={() => console.log("button is pressed!")}>
                Sign-up 
                </HandwrittenButton> */}

{/* textShadowColor: "black", textShadowOffset: {width: 10, height: 10}, textShadowRadius: 10 */}