import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import firebase from "firebase";
import Connection from "./Connection";
import styles from "./ListConnections.module.css"

const db = firebase.firestore();

function ListConnections(props) {

    const [connections, setConnections] = useState([]);

    useEffect(() => {

        let fetchVal;
        fetchVal = db.collection("connections").where("personOne", "==", props.user.uid).
        onSnapshot((queryResult) =>
        {
            let arrRes = [];
            queryResult.forEach((doc) => {
                console.log(doc.data());
                const personTwoUid = doc.data().personTwo;
                arrRes.push(<Connection personOneUid={props.user.uid} personTwoUid={personTwoUid} key={personTwoUid}/>);

            })
            console.log(arrRes);
            setConnections(arrRes);
        });

        return function unsub() {
            fetchVal();
        }

    }, [])

    return (
        <div className={styles.container}>
            <h2>Connections</h2>
            {
                connections.map((conn) => {
                    return (
                        <div>{conn}</div>

                    );
                })
            }
        </div>
    )

}

export default ListConnections;
