import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { UserModel } from "../models/User";
import dbConnect from "../utils/dbConnect";

export default function App() {
    // fetch and map all the event cards assoc with this school.
    // based on labels, decide on an order to show them.
    return (
        <p>app</p>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) return {redirect: {permanent: false, destination: "/"}};

    try {
        await dbConnect();
        const thisUser = await UserModel.findOne({email: session.user.email});
        return thisUser ? {props: {user: thisUser}} : {redirect: {permanent: false, destination: "/welcome"}};
    } catch (e) {
        console.log(e);
        return {redirect: {permanent: false, destination: "/welcome"}};
    }
};