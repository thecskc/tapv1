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

    if(loading){
        return <div/>
    }
    return (
        <div>
            <div>{profile.email}</div>
            <div>{props.personTwoData}</div>
            <button onClick={clickTap}>Tap</button>

        </div>
    )


}

export default Connection;