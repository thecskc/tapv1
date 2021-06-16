import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import firebase from "firebase";
import Connection from "./Connection";
import styles from "./ListConnections.module.css"


const db = firebase.firestore();


function ListConnections(props) {

    const [connections, setConnections] = useState([])


    useEffect(() => {

        let fetchVal = db.collection("connections").where("personOne", "==", props.user.uid).onSnapshot(
            (queryResult) => {
                let arrRes = [];
                queryResult.forEach((doc) => {
                    console.log(doc.data());
                    const personTwoAvailability = doc.data().personTwoAvailability;
                    const personTwoUid = doc.data().personTwo;
                    const state = doc.data().state;

                    if (!personTwoAvailability || personTwoAvailability === "available") {
                        arrRes.push(<Connection personOneUid={props.user.uid} personTwoUid={personTwoUid}
                                                state={state} key={personTwoUid}/>);
                    }
                })
                console.log(arrRes);
                setConnections(arrRes);
            });

        return function unsub() {
            fetchVal();
        }


    }, []);

    return (
        <div className={styles.container}>
            <h3>Connections</h3>
            {
                connections.map((val) => {
                    return (
                        <div>{val}</div>

                    );
                })
            }
        </div>
    )


}

export default ListConnections;