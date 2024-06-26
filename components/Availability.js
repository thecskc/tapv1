import React from "react";
import firebase from "firebase";
import {useState} from "react";
import {useEffect} from "react";
import "firebase/analytics";


const db = firebase.firestore();
let analytics;

function Availability(props) {

    const [loading, setLoading] = useState(true)
    const [availabilityState, setAvailabilityState] = useState("")

    useEffect(() => {
        analytics = firebase.analytics();
        analytics.setUserId(props.user.uid);
    }, [])

    useEffect(() => {
        db.collection("users").doc(props.user.uid).get().then((doc) => {
            setAvailabilityState(doc.data().availability)
            setLoading(false);
        })
    },[])

    function handleAvailabilityChange(e) {
        const value = e.target.value;

        const uid = props.user.uid;

        analytics.logEvent("change_availability", {uid: uid, value: value});

        const batch = db.batch();

        db.collection("users").doc(uid).set({availability: value}, {merge: true});

        setAvailabilityState(value);


    }

    if (loading) {
        return <div/>
    }

    return (

            <div className={"field"}>

                <div className={"control"}>
                    <div className={"select is-info"}>
                        <select value={availabilityState}
                                onChange={(e) => handleAvailabilityChange(e)}>
                            <option value="available">Available</option>
                            <option value="donotdisturb">Do Not Disturb</option>
                        </select>
                    </div>
                </div>

            </div>
    )

}


export default Availability;