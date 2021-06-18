import React from "react";
import firebase from "firebase";
import {useEffect} from "react";
import {useState} from "react";
import styles from "./Connection.module.css"
import "firebase/analytics";


const db = firebase.firestore();
let analytics;


function Connection(props) {

    const [loading,setLoading] = useState(true);
    const [personTwoProfile, setPersonTwoProfile] = useState({});
    const [personOneProfile,setPersonOneProfile] = useState({});

    useEffect(()=>{
        analytics = firebase.analytics();
        analytics.setUserId(props.personOneUid);
    },[])


    useEffect(() => {
        db.collection("users").doc(props.personTwoUid).get().then((result) => {
            console.log(result.data());
            setPersonTwoProfile(result.data());

            db.collection("users").doc(props.personOneUid).get().then((result)=>{
                setPersonOneProfile(result.data());
                setLoading(false);

            })

        })
    }, [])


    const clickTap = function(event){

        analytics.logEvent("click_tap",{personOne:props.personOneUid,personTwo:props.personTwoUid});


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

    const setDefaultDB = function(){
        db.collection("connections").doc(props.personOneUid + props.personTwoUid).set({
            "state": "DEFAULT"
        }, {
            merge: true
        }).then(() => {
            console.log("Update success!");
        });
    }

    const processSendRequest = function(event){
        event.preventDefault();
        setDefaultDB();
        analytics.logEvent("join_room_send_request",{sent_by:props.personOneUid});

        window.location.href = personTwoProfile.room_url; // redirect to tapee's room
    }

    const processReceiveRequest = function(event){
        event.preventDefault();
        setDefaultDB();
        analytics.logEvent("join_room_receive_request",{received_by:props.personOneUid});
        window.location.href = personOneProfile.room_url; // redirect to my room
    }

    if(loading){
        return <div/>
    }

    let statusButton;

    if(props.state === "SEND_REQUEST"){

        statusButton = <button className={styles.tapbutton} onClick={processSendRequest}>Join {personTwoProfile.email} room</button>

    }
    else if(props.state === "RECEIVE_REQUEST"){
        let notif = new Notification("You have been tapped!");
        statusButton = <button className={styles.tapbutton} onClick={processReceiveRequest}> You have been tapped. Join room</button>


    }
    else{
        statusButton =<button className={styles.tapbutton} onClick={clickTap}>Tap</button>;
    }

    return (
        <div className={styles.container}>
            <div style={{paddingLeft:"32px",paddingRight:"32px"}}>{personTwoProfile.email}</div>
            {statusButton}
        </div>
    )


}

export default Connection;