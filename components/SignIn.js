import React from "react";
import {useEffect} from "react";
import {useState} from "react";
import firebase from "firebase";

const db = firebase.firestore();

function SignIn(props) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function signIn(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
            props.setUser(userCredential.user);
        })
    }

    async function addToUsers(obj, userVal) {
        await db.collection("users").doc(obj.uid).set(obj);
        props.setUser(userVal);
    }

    async function signUp(email, password) {
        await firebase.auth().createUserWithEmailAndPassword(email, password).then(
            (userCredential) => {
                const user = userCredential.user;
                const obj = {
                    "uid": user.uid,
                    "email": user.email
                }
                addToUsers(obj, user)

            }
        )
    }

    async function submitForm(e) {
        e.preventDefault();
        console.log("trying to submit form", email, password);
        db.collection("users").where("email", "==", email).get().then((querySnapshot) => {
            let dataArr = [];
            querySnapshot.forEach((doc) => {
                dataArr.push(doc);
            })
            if (dataArr.length === 0) {
                //user doesn't exist
                signUp(email, password);

            } else {
                //user exists, sign in
                signIn(email, password);
            }

        })

    }

    return (
        <div className={"section is-large"} style={{border: "solid 1px"}}>
            <div className={"container"}>
                <h1 className="title">Sign Up/ Sign In</h1>

                <div className={"form"}>

                    <div className={"field"}>
                        <label className={"label"}>Email</label>
                        <div className={"control"}>
                            <input className={"input"} placeholder={"Enter your email"} type={"email"} value={email}
                                   onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                    </div>
                    <div className={"field"}>
                        <label className={"label"}>Password</label>
                        <div className={"control"}>
                            <input className={"input"} placeholder={"Enter your password"} type={"password"}
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </div>

                    <div className={"field"}>
                        <div className={"control"}>

                    <button className={"button is-primary"} onClick={submitForm}>Submit</button>

                        </div>

                    </div>


                </div>

            </div>
        </div>
    )

}

export default SignIn;