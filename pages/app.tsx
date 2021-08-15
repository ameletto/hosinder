import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { UserModel } from "../models/User";

export default function App() {
    return (
        <p>app</p>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) return {redirect: {permanent: false, destination: "/"}};

    try {
        const thisUser = await UserModel.findOne({email: session.user.email});
        return thisUser ? {props: {user: thisUser}} : {redirect: {permanent: false, destination: "/welcome"}};
    } catch (e) {
        console.log(e);
        return {redirect: {permanent: false, destination: "/welcome"}};
    }
};