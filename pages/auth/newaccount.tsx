import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import useSWR, { SWRResponse } from "swr";
import Container from "../../components/Container";
import CuteGradientCircle from "../../components/CuteGradientCircle";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import HandwrittenButton from "../../components/HandwrittenButton";
import SEO from "../../components/SEO";
import { UserModel } from "../../models/User";
import dbConnect from "../../utils/dbConnect";
import fetcher from "../../utils/fetcher";
import { DatedObj, EventObj, SchoolObj } from "../../utils/types";

export default function NewAccount({ }: {}) {
    const router = useRouter();
    const [session, loading] = useSession();
    const [grade, setGrade] = useState<number>(0);
    const [school, setSchool] = useState<string>("61216845561457369cdd35ae"); // defaulting everyone to mgci for now.
    const [labels, setLabels] = useState<string[]>([]);
    const [prevEvents, setPrevEvents] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    // const {data: schoolData, error: schoolError}: SWRResponse<{data: DatedObj<SchoolObj>[]}, any> = useSWR(`/api/school`, fetcher);
    const {data: eventsData, error: eventsError}: SWRResponse<{data: DatedObj<EventObj>[]}, any> = useSWR(`/api/event`, fetcher);

    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/auth/account", {
            grade: grade,
            school: school,
            labels: labels,
            previousEvents: prevEvents,
        }).then(res => {
            if (res.data.error) {
                setError(res.data.error);
                setIsLoading(false);
            } else {
                console.log("redirecting...");
                router.push("/app");
            }
        }).catch(e => {
            setIsLoading(false);
            setError("An unknown error occurred.");
            console.log(e);
        });
    }
    function setGradeValue(e){
        setGrade(e.target.value);
        setError(null);
    }

    const onLabelChange = (label, clear = false) => {
        let newLabels;
        if (clear) {
            // todo clearning doesn tfully work
            console.log("clearing")
            if (label === "individual" || label === "team") newLabels = labels.filter(l => l !== "individual" && l !== "team");
            else if (label === "KT" || label === "skill") newLabels = labels.filter(l => l !== "KT" && l !== "skill");
        } else { 
            if (label === "individual" || label === "team") newLabels = [...labels.filter(l => l !== "individual" && l !== "team"), label];
            else if (label === "KT" || label === "skill") newLabels = [...labels.filter(l => l !== "KT" && l !== "skill"), label];
            // else setLabels([...labels, label]);
        }
        console.log(newLabels)
        setLabels(newLabels)
    }

    return (
        <Container width="7xl">
            <SEO title="New account" />
            <div className="mb-6">
                <h1 className="text-2xl font-semibold raleway text-4xl text-center">Tell us about yourself</h1>
                <div className="flex justify-center"><div className="-mt-3 ml-10 border-primary" style={{borderBottomWidth: 10, width: 360, zIndex: -1}}></div></div>
            </div>
            <CuteGradientCircle className="w-16 h-16 fixed left-10 top-16"/>
            <CuteGradientCircle className="w-16 h-16 fixed right-10 top-48"/>
            <CuteGradientCircle className="w-16 h-16 fixed left-48 bottom-16"/>
                
            {loading ? (
                <Skeleton count={2} />
            ) : (
                <div className="flex flex-col justify-center md:flex-row p-4 oswald">
                    <img
                        src={session.user.image}
                        alt={`Profile picture of ${session.user.name}`}
                        className="rounded-full h-14 w-14 mr-4"
                    />
                    <div>
                        <p className="text-xl">{session.user.name}</p>
                        <p className="text-xl">{session.user.email}</p>
                    </div>
                </div>
            )}
            <CustomSectionComponent>
                <CustomLabelComponent>Grade:</CustomLabelComponent>
                <div onChange={e => setGradeValue(e)} className="md:w-full flex flex-row gap-4">
                    {[9, 10, 11, 12].map(g => (
                    <>
                    <input type="radio" id={g.toString()} name="grade" value={g} style={{display: "none",}}/>
                    <label 
                        htmlFor={g.toString()} 
                        className={`block w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition font-normal text-gray-500 ${g == grade && "bg-primary text-gray-700"}`}
                    ><p>{g}</p></label>
                    </>
                ))}
                </div>
            </CustomSectionComponent>
            {/* <h2 className="sectionClasses text-black text-xl font-semibold">School:</h2> */}
            {/* <div className="flex items-center"> */}

                {/* <Select 
                    options={schoolData && schoolData.data && schoolData.data.map(s => ({
                        value: s._id,
                        label: s.name,
                    }))}
                    onChange={option => setSchool(option.value)}
                    isDisabled={isLoading}
                    className="w-full"
                /> */}
                {/* <p>Don't see your school? Tell your execs to create a school.<br/>Or, continue without one.</p> */}
            {/* </div> */}
            <CustomSectionComponent>
                <CustomLabelComponent>Previous HOSA events:</CustomLabelComponent>
                <Select 
                    isMulti
                    options={eventsData && eventsData.data && eventsData.data.map(event => ({
                        value: event._id,
                        label: event.name,
                    }))}
                    onChange={newSelectedOptions => setPrevEvents(newSelectedOptions.map(option => option.value))}
                    isDisabled={isLoading}
                    isClearable={true}
                    className="font-normal w-full md:flex-grow"
                    id="prevEvents"
                />
                {/* <select name="hosaEvents" id="hosaEvents" multiple>
                    <option value="none">-</option>
                    <option value="behavHealth">Behavioral Health</option>
                    <option value="dentTerm">Dental Terminology</option>
                    <option value="humanGrDev">Human Growth and Development </option>
                    <option value="medLawEth">Medical Law and Ethics</option>
                    <option value="medMath">Medical Math</option>
                    <option value="medSpell">Medical Spelling</option>
                    <option value="medTerm">Medical Terminology</option>
                    <option value="nutr">Nutrition</option>
                    <option value="pathophy">Pathophysiology</option>
                    <option value="researPersSpeak">Researched Persuasive Speaking</option>
                    <option value="CERT">CERT Skills</option>
                    <option value="CPR">CPR / First Aid</option>
                    <option value="EMT">Emergency Medical Technician</option>
                    <option value="epidemi">Epidemiology</option>
                    <option value="pubHealth">Public Health</option>
                    <option value="biomedLabSci">Biomedical Laboratory Science</option>
                    <option value="clinNurs">Clinical Nursing</option>
                    <option value="clinSpec">Clinical Specialty</option>
                    <option value="dentSci">Dental Science</option>
                    <option value="pharmSci">Pharmacy Science</option>
                    <option value="physThera">Physical Therapy</option>
                    <option value="sportsMed">Sports Medicine</option>
                    <option value="vetSci">Veterinary Science</option>
                    <option value="biomedDebate">Biomedical Debate</option>
                    <option value="commAware">Community Awareness</option>
                    <option value="creativeProbSol">Creative Problem Solving</option>
                    <option value="forenSci">Forensic Science</option>
                    <option value="HOSABowl">HOSA Bowl</option>
                    <option value="medInno">Medical Innovation</option>
                </select> */}
            </CustomSectionComponent>

            <CustomSectionComponent>
                <CustomLabelComponent>Do you prefer team events or individual events (optional):</CustomLabelComponent>
                <Select 
                    options={[
                        {value: "team", label: "Team events"},
                        {value: "individual", label: "Individual events"},
                    ]}
                    onChange={option => onLabelChange(option ? option.value : "Team events", !option)}
                    isDisabled={isLoading}
                    isClearable={true}
                    className="font-normal w-full md:flex-grow"
                    id="teamVsIndividual"
                />

                {/* <select name="teamOrIndiv" id="teamOrIndiv">
                    <option value="none">-</option>
                    <option value="team">Team Events</option>
                    <option value="individual">Individual Events</option>
                </select> */}
            </CustomSectionComponent>

            <CustomSectionComponent>
                <CustomLabelComponent>Do you prefer knowledge tests or skill performances (optional):</CustomLabelComponent>
                <Select 
                    options={[
                        {value: "KT", label: "Knowledge tests"},
                        {value: "skill", label: "Skill performances"},
                    ]}
                    onChange={option => onLabelChange(option ? option.value : "KT", !option)}
                    isDisabled={isLoading}
                    isClearable={true}
                    className="font-normal w-full md:flex-grow"
                    id="ktvsskill"
                />
                {/* <select name="KTorSkillPerf" id="KTorSkillPerf">
                    <option value="none">-</option>
                    <option value="KT">Knowledge Tests</option>
                    <option value="skill">Skill Performances</option>
                </select> */}
            </CustomSectionComponent>

            {error && (
                <p className="text-red-500">{error}</p>
            )}
            <div className="flex w-full justify-center my-12 oswald font-bold text-xl">
                <HandwrittenButton
                    // isLoading={isLoading}
                    onClick={onSubmit}
                    disabled={loading || grade === 0 || !school}
                >
                    SUBMIT
                </HandwrittenButton>
            </div>
        </Container>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

            if (!session) return {redirect: {permanent: false, destination: "/auth/welcome"}};

            try {
        await dbConnect();
        const thisUser = await UserModel.findOne({email: session.user.email});
            return thisUser ? {redirect: {permanent: false, destination: "/app"}} : {props: { }};
    } catch (e) {
                console.log(e);
            return {props: { }};
    }
};

const CustomLabelComponent = ({children}: {children: string}) => <div className="md:w-1/2 text-center md:text-right mr-6 mb-2 md:mb-0"><label>{children}</label></div>
const CustomSectionComponent = ({children}: {children: ReactNode}) => <div className="flex flex-col md:flex-row items-center my-8 oswald font-bold text-xl">{children}</div>