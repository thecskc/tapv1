import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import firebase from "firebase";
import Connection from "./Connection";


const db = firebase.firestore();


function ListConnections(props) {

    const [connections, setConnections] = useState([])



    useEffect(() => {

        let fetchVal = db.collection("connections").where("personOne", "==", props.user.uid).onSnapshot(
            (queryResult) => {
                let arrRes = [];
                queryResult.forEach((val) => {
                    console.log(val.data());
                    arrRes.push(<Connection personOneUid = {props.user.uid} personTwoUid={val.data().personTwo} state={val.data().state} key={val.data().personTwo}/>);
                })
                console.log(arrRes);
                setConnections(arrRes);
            });

        return function unsub(){
            fetchVal();
        }


    }, []);

    return (
        <div>
            { 
                connections.map((val) => {
                    return(
                      <div>{val}</div>

                    );
                })
            }
        </div>
    )


}

export default ListConnections;