import React from "react";
import firebase from "firebase";
import {useEffect} from "react";
import {useState} from "react";


const db = firebase.firestore();


function Connection(props) {

    const [loading,setLoading] = useState(true);
    const [profile, setProfile] = useState({});

    useEffect(() => {

        db.collection("users").doc(props.uid).get().then((result) => {
            console.log(result.data());
            setLoading(false);
            setProfile(result.data());
        })


    }, [])

    const clickTap = function(event){
        event.preventDefault();
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