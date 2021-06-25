import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import firebase from "firebase";
import Connection from "./Connection";

const db = firebase.firestore();

function ListConnections(props) {

    const [connections, setConnections] = useState([]);

    useEffect(() => {

        let fetchVal;
        fetchVal = db.collection("connections").where("personOne", "==", props.user.uid).onSnapshot((queryResult) => {
            let arrRes = [];
            queryResult.forEach((doc) => {
                console.log(doc.data());
                const personTwoUid = doc.data().personTwo;
                arrRes.push(<Connection personOneUid={props.user.uid} personTwoUid={personTwoUid} key={doc.id}/>);

            })
            console.log(arrRes);
            setConnections(arrRes);
        });

        return function unsub() {
            fetchVal();
        }

    }, [])

    return (

        <>
            <h2 className={"title is-3"}>Connections</h2>
            {
                connections.map((conn) => {
                    return (
                        <div className={"block"}>{conn}</div>

                    );
                })
            }
        </>
    )

}

export default ListConnections;
