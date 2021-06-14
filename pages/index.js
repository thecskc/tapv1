import firebase from "firebase";
import { useState } from "react";
import { useEffect } from "react";
import SignIn from "../components/SignIn";
import ListConnections from "../components/ListConnections";

const db = firebase.firestore();

function Home() {
  const [user, setUser] = useState("");

  async function getUser() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }

  useEffect(() => {
    getUser();
  }, []);

  if (user) {
    return (
      <div>
        <ListConnections user={user} />
      </div>
    );
  } else {
    return <SignIn setUser={setUser} />;
  }
}

export default Home;
