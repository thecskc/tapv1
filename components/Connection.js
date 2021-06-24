import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import firebase from "firebase";

const db = firebase.firestore();
let analytics;

function Connection(props) {


    const [loading, setLoading] = useState(true);
    const [personTwoProfile, setPersonTwoProflle] = useState({});
    const [connectionState, setConnectionState] = useState("");
    const [personOneProfile, setPersonOneProfile] = useState();
    let connectionData;

    useEffect(() => {
        analytics = firebase.analytics();
        analytics.setUserId(props.personOneUid);
    }, [])

    useEffect(() => {

        let personTwoUnsub = db.collection("users").doc(props.personTwoUid).onSnapshot((doc) => {
            setPersonTwoProflle(doc.data());
        })

        setLoading(false);

        return function unsub() {
            personTwoUnsub();
        }
    }, [])

    useEffect(() => {
        db.collection("users").doc(props.personOneUid).get().then((doc) => {
            setPersonOneProfile(doc.data());
        })
    }, [])

    useEffect(() => {

        let connectionListener = db.collection("connections").doc(props.personOneUid + props.personTwoUid)
            .onSnapshot((doc) => {
                connectionData = doc.data();
                setConnectionState(connectionData.state);

            })

        return function unsub() {
            connectionListener();
        }

    }, [])

    //loading personTwoProfile
    if (loading) {
        return <div/>;
    }

    //loading personOneProfile
    if (!personOneProfile) {
        return <div/>
    }

    //if person two unavailable
    if (personTwoProfile.availability !== "available") {
        return <div/>;
    }

    //if no connection state
    if (!connectionState) {
        console.log("No connection state right now");
        return <div/>
    }


    /*
    To get to this portion of the code -

    - PersonTwo's profile has been loaded
    - Person Two is available to Tap
    - Person One's profle has been loaded
    - Connection state is one of three known states

     */

    function setDefaultStateDB() {
        db.collection("connections").doc(props.personOneUid + props.personTwoUid).set({
            "state": "DEFAULT"
        }, {
            merge: true
        }).then(() => {
            console.log("Update success!");
        });
    }

    function clickTap(event) {

        event.preventDefault();
        analytics.logEvent("click_tap", {personOne: props.personOneUid, personTwo: props.personTwoUid});


        db.collection("connections").doc(props.personOneUid + props.personTwoUid).set({
            "state": "SEND_REQUEST"
        }, {
            merge: true
        }).then(() => {
            console.log("Update success!");
        });


        db.collection("connections").doc(props.personTwoUid + props.personOneUid).set({
            "state": "RECEIVE_REQUEST"
        }, {
            merge: true
        }).then(() => {
            console.log("Update success!");
        });


    }

    function handleSendRequest(event) {
        event.preventDefault();
        analytics.logEvent("join_room_send_request", {sent_by: props.personOneUid});
        setDefaultStateDB();
        window.location.href = personTwoProfile.room_url;
    }

    function handleReceiveRequest(event) {
        event.preventDefault();
        analytics.logEvent("join_room_receive_request", {received_by: props.personOneUid});
        setDefaultStateDB();
        window.location.href = personOneProfile.room_url;
    }

    let statusButton;
    if (connectionState === "DEFAULT") {

        statusButton = <button className={"button is-primary is-outlined"} onClick={clickTap}>Tap</button>;

    } else if (connectionState === "SEND_REQUEST") {

        statusButton = <button className={"button is-primary is-outlined"}
                               onClick={handleSendRequest}>Join {personTwoProfile.email} room</button>

    } else if (connectionState === "RECEIVE_REQUEST") {

        let notif = new Notification("You have been tapped!");
        statusButton =
            <button className={"button is-primary is-outlined"} onClick={handleReceiveRequest}> You have been tapped.
                Join room</button>

    }

    return (
        <div className={"columns is-mobile notification"}>
            <div className={"column is-four-fifths"}>
                <h6 className={"title is-6"}>{personTwoProfile.email}</h6>
            </div>
            {statusButton}

        </div>


    )


}

export default Connection;