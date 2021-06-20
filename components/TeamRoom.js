import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import firebase from "firebase";
import styles from "./TeamRoom.module.css"

const db = firebase.firestore();
let analytics;

function TeamRoom(props) {


    const roomID = props["room-info"].id;
    const [roomData,setRoomData] = useState(props["room-info"].data());

    let statusMessage = "";

    function clickTap(event){
        event.preventDefault();
        window.location.href = roomData.room_url;
    }

    useEffect(()=>{

        let roomListener = db.collection("teamrooms").doc(roomID).onSnapshot((doc)=>{
            console.log("Snapshot",doc.data());
            setRoomData(doc.data());
        })

        return function unsub(){
            roomListener();
        }
    },[])

    if(!roomData.population || roomData.population === 0){
        console.log("No population data");
        statusMessage = "Tap";
    }
    else{
        statusMessage =`Join ${(roomData.population).toString()} others!`
    }


    return (
        <div className={styles.container}>
            <div>{roomData.room_name}</div>
            <button className={styles.tapbutton} onClick={clickTap}>{statusMessage}</button>

        </div>
    )


}

export default TeamRoom;