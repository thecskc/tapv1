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

    function handleRequestAccepted(event) {
        event.preventDefault();
        analytics.logEvent("join_room", {sent_by: props.personOneUid});
        setDefaultStateDB();
        window.location.href = personTwoProfile.room_url;
    }

    function handleReceiveRequestAcceptTap(event) {
        event.preventDefault();
        analytics.logEvent("receive_request_accept_tap", {received_by: props.personOneUid});
        setDefaultStateDB();
        db.collection("connections").doc(props.personTwoUid + props.personOneUid).set({
            "state": "REQUEST_ACCEPTED"
        }, {merge: true})
        window.location.href = personOneProfile.room_url;
    }

    function handleReceiveRequestRejectTap(event) {
        event.preventDefault();
        analytics.logEvent("receive_request_reject_tap", {received_by: props.personOneUid});
        setDefaultStateDB();
        db.collection("connections").doc(props.personTwoUid + props.personOneUid).set({
            "state": "REQUEST_REJECTED"
        }, {merge: true})
        let notif = new Notification("Please mark yourself as unavailable!");

    }

    let statusButton;
    if (connectionState === "DEFAULT") {

        statusButton = <button className={"button is-primary is-outlined"} onClick={clickTap}>Tap</button>;

    } else if (connectionState === "SEND_REQUEST") {

        statusButton =
            <button disabled className={"button is-primary is-outlined"}>Request Sent!</button>

    } else if (connectionState === "RECEIVE_REQUEST") {

        let notif = new Notification("You have been tapped!");
        statusButton = <div className={"buttons are-small"}>
            <button className={"button is-primary is-success"} onClick={handleReceiveRequestAcceptTap}> Accept Tap!
            </button>
            <button className={"button is-outlined"} onClick={handleReceiveRequestRejectTap}>
                Can't Talk Right Now!
            </button>
        </div>

    } else if (connectionState === "REQUEST_ACCEPTED") {
        let notif = new Notification(`${personTwoProfile.email} accepted your Tap. Join Now!`);
        statusButton =
            <button className={"button is-success"} onClick={handleRequestAccepted}> Join!
            </button>

    } else if (connectionState === "REQUEST_REJECTED") {
        let notif = new Notification(`${personTwoProfile.email} is unavailable right now`);
        setTimeout(
            function () {
                setDefaultStateDB();
            }, 2000
        );

    }


    return (
        <div className={"columns is-mobile notification"}>
            <div className={"column is-three-fifths"}>
                <h6 className={"title is-6"}>{personTwoProfile.email}</h6>
            </div>
            {statusButton}

        </div>


    )


}

export default Connection;