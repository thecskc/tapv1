import React from "react";
import firebase from "firebase";
import {useEffect} from "react";
import {useState} from "react";


const db = firebase.firestore();


function Connection(props) {

    const [loading,setLoading] = useState(true);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        db.collection("users").doc(props.personTwoUid).get().then((result) => {
            console.log(result.data());
            setLoading(false);
            setProfile(result.data());
        })
    }, [])

    const clickTap = function(event){
        db.collection("connections").doc(props.personTwoUid + props.personOneUid).set({
            "state": "RECEIVE_REQUEST"
        }, {
            merge: true
        }).then(() => {
            console.log("Update success!");
        });

        db.collection("connections").doc(props.personOneUid + props.personTwoUid).set({
            "state": "SEND_REQUEST"
        }, {
            merge: true
        }).then(() => {
            console.log("Update success!");
        });
    }

    const updateDefaultState = function(event){
        db.collection("connections").doc(props.personTwoUid + props.personOneUid).set({
            "state": "DEFAULT"
        }, {
            merge: true
        }).then(() => {
            console.log("Update success!");
        });

        db.collection("connections").doc(props.personOneUid + props.personTwoUid).set({
            "state": "DEFAULT"
        }, {
            merge: true
        }).then(() => {
            console.log("Update success!");
        });
    }

    if(loading){
        return <div/>
    }

    let statusButton;

    if(props.state === "SEND_REQUEST"){

        statusButton = <button onClick={updateDefaultState}>Join {profile.email} room</button>

    }
    else if(props.state === "RECEIVE_REQUEST"){
        statusButton = <button onClick={updateDefaultState}> You have been tapped. Join room</button>
    }
    else{
        statusButton =<button onClick={clickTap}>Tap</button>;
    }

    return (
        <div>
            <div>{profile.email}</div>
            {statusButton}


        </div>
    )


}

export default Connection;