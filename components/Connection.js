import React from "react";
import firebase from "firebase";
import { useEffect } from "react";
import { useState } from "react";

const db = firebase.firestore();

function Connection(props) {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    db.collection("users")
      .doc(props.uid)
      .get()
      .then((result) => {
        console.log(result.data());
        setProfile(result.data());
      });
  }, []);

  return (
    <div>
      <div>{profile.email}</div>
      <a href={"https://www.tomo.chat/tapone"}>Tap</a>
    </div>
  );
}

export default Connection;
