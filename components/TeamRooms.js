import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import firebase from "firebase";
import TeamRoom from "./TeamRoom";


const db = firebase.firestore();
let analytics;

function TeamRooms(props) {


    const [teamRooms, setTeamRooms] = useState([]);

    useEffect(() => {
        analytics = firebase.analytics();
        analytics.setUserId(props.user.uid);
    }, []);


    useEffect(() => {

        db.collection("teamrooms").where("uservisibility", "array-contains", props.user.uid).get()
            .then((queryResult) => {

                let arrResult = [];
                queryResult.forEach((doc, keyVal) => {
                    console.log(doc.id);
                    console.log(doc.data());

                    // arrResult.push(doc.data());
                    arrResult.push(<TeamRoom room-info={doc} key={doc.id.toString()}/>);

                })

                setTeamRooms(arrResult);

            })

    }, [])

    if (teamRooms.length === 0) {
        return <div/>
    }

    return (
        <>

            <h2 className={"title is-3"}>Team Rooms</h2>
            {
                teamRooms.map((room) => {
                    return room
                })
            }
        </>
    )


}

export default TeamRooms;