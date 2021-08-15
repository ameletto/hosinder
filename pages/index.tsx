import SignInButton from "../components/SignInButton"

export default function Home() {

    return (
        // <div className= font>
        <div>
        <p className = "absolute left-5 truncate z-10 text-gray-50" style={{fontSize: 30}}> HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA</p> 
        <p className = "absolute right-0 top-0" style={{transform: "rotate(90deg)"}}> TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER </p>
        <p className = "absolute right-0 bottom-0" style={{transform: "rotate(180deg)"}}> HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA </p>
        <p className = "absolute left-0 bottom-0" style={{transform: "rotate(270deg)"}}> TINDER HOSA TINDER HOSA TINDER HOSA TINDER HOSA TINDER</p>
        
        <div className = "absolute w-96 h-96 rounded-full z-0" style={{background: "radial-gradient(rgba(2,1,31,1) -10%, rgba(5,25,138,1) 26%, rgba(0,212,255,1) 95%)"}}>
        </div>
        
        <div className="flex items-center justify-center flex-col h-screen michroma font-black">
            <div className="flex flex-row">
            {/* <HandwrittenButton onClick={() => console.log("button is pressed!")}>
                Sign-up 
                </HandwrittenButton> */}
                <SignInButton/> 
            </div>
        <h1>Welcome to HOSA Tinder</h1>
        <h2>Find your perfect event.</h2>

        {/* textShadowColor: "black", textShadowOffset: {width: 10, height: 10}, textShadowRadius: 10 */}
        </div>



        </div>
    );
}

// class = className
// save
// div