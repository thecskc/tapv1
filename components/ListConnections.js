import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import firebase from "firebase";
import Connection from "./Connection";


const db = firebase.firestore();


function ListConnections(props) {

    const [connections, setConnections] = useState([]);

    useEffect(() => {

        db.collection("connections").where("personOne", "==", props.user.uid).get().then(
            (queryResult) => {
                let arrRes = [];
                queryResult.forEach((val) => {
                    console.log(val.data());
                    arrRes.push(<Connection uid={val.data().personTwo} key={val.data().personTwo}/>);
                })
                console.log(arrRes);
                setConnections(arrRes);
            })

    }, []);

    return (
        <div>
            {
                connections.map((val) => {
                    return(val);
                })
            }
        </div>
    )


}

export default ListConnections;