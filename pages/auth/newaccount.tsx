import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession, signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useState } from "react";
import Skeleton from "react-loaoding-skeleton";
import Button from "../../components/Button";
import CreateSchoolModal from "../../components/CreateSchoolModal";
import HandwrittenButton from "../../components/HandwrittenButton";
import SEO from "../../components/SEO";
import { UserModel } from "../../models/User";

export default function NewAccount({}: {}) {
    const router = useRouter();
    const [session, loading] = useSession();
    const [grade, setGrade] = useState<number>(0);
    const [school, setSchool] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const [isCreateSchool, setIsCreateSchool] = useState<boolean>(false);

    // const {data: schoolData, error: schoolError}: SWRResponse<DatedObj<SchoolObj>[], any> = useSWR(`/api/school`, fetcher);
    // console.log(schoolData)

    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/auth/account", {
            grade: grade,
            school: school,
        }).then(res => {
            if (res.data.error) {
                setError(res.data.error);
                setIsLoading(false);
            } else {
                console.log("redirecting...");
                signIn("google").then(() => router.push("/app")).catch(e => console.log(e));
            }
        }).catch(e => {
            setIsLoading(false);
            setError("An unknown error occurred.");
            console.log(e);
        });
    }

    return (
        <>
            <SEO title="New account"/>
            <h1>Create new account</h1>
            {loading ? (
                <Skeleton count={2}/>
            ) : (
                <div className="flex items-center">
                    <img
                        src={session.user.image}
                        alt={`Profile picture of ${session.user.name}`}
                        className="rounded-full h-12 h-12 mr-4"
                    />
                    <div>
                        <p>{session.user.name}</p>
                        <p>{session.user.email}</p>
                    </div>
                </div>
            )}
            <h2>What grade are you in?</h2>
            <div className="flex items-center">
                <div onChange={e => {
                        setGrade(e.target.value);
                        setError(null);
                    }}>
                    <input type="radio" id="9" name="grade" value={9}/>
                    <input type="radio" id="10" name="grade" value={10}/>
                    <input type="radio" id="11" name="grade" value={11}/>
                    <input type="radio" id="12" name="grade" value={12}/>
                </div>
                <p>{grade}</p>
            </div>
            <h2>What school do you go to?</h2>
            <div className="flex items-center">
                {/* <input
                    type="text"
                    value={school}
                    onChange={e => {
                        setSchool(e.target.value);
                        if (e.target.value !== encodeURIComponent(e.target.value)) {
                            setError("URLs cannot contain spaces or special characters.");
                        }
                        setError(null);
                    }}
                /> */}
                {/* <Select 
                    options={schoolData.data.map(s => ({
                        value: s._id,
                        label: s.name,
                    }))}
                    onChange={option => setSchool(option.value)}
                    isSearchable={false}
                    isDisabled={isLoading}
                /> */}
            <div>
                <Button onClick={() => setIsCreateSchool(true)}>Don't see your school? Create a school.</Button>
                <CreateSchoolModal 
                    isOpen={isCreateSchool}
                    setIsOpen={setIsCreateSchool}
                    setSchoolId={setSchool}
                />
            </div>
            </div>
            {error && (
                <p className="text-red-500">{error}</p>
            )}
            <HandwrittenButton
                // isLoading={isLoading}
                onClick={onSubmit}
                disabled={loading || school !== encodeURIComponent(school) || grade === 0 || school.length === 0}
            >
                Let's get started!
            </HandwrittenButton>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) return {redirect: {permanent: false, destination: "/auth/signin"}};

    try {
        const thisUser = await UserModel.findOne({email: session.user.email});
        return thisUser ? {redirect: {permanent: false, destination: "/app"}} : {props: {}};
    } catch (e) {
        console.log(e);
        return {props: {}};
    }
};