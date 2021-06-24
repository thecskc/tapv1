import firebase from "firebase";
import {useState} from "react";
import {useEffect} from "react";
import SignIn from "../components/SignIn";
import ListConnections from "../components/ListConnections";
import Availability from "../components/Availability";
import TeamRooms from "../components/TeamRooms";

const db = firebase.firestore();

function Home() {

    const [user, setUser] = useState("");

    useEffect(() => {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                console.log("permission granted");
            }
        });
    }, [])


    async function getUser() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            }
        });
    }

    useEffect(() => {
        getUser();
    }, [])


    if (user) {
        return (
            <div className={"section"}>

                <div className={"container is-mobile"}>

                    <Availability user={user}/>
                    <ListConnections user={user}/>
                    <TeamRooms user={user}/>

                </div>
            </div>);
    } else {

        return (<SignIn setUser={setUser}/>);
    }

}


export default Home;