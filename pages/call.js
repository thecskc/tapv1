import DailyIframe from '@daily-co/daily-js';
import { useEffect } from 'react';


export default function makeCall() {

    function playTrack(evt) {
        console.log(
            "[TRACK STARTED]",
             evt.participant && evt.participant.session_id
           );
    
           // sanity check to make sure this is an audio track
           if (!(evt.track && evt.track.kind === "audio")) {
             console.error("!!! playTrack called without an audio track !!!", evt);
             return;
           }
    
           // don't play the local audio track (echo!)
           if (evt.participant.local) {
             return;
           }
    
           let audioEl = document.createElement("audio");
           document.body.appendChild(audioEl);
           audioEl.srcObject = new MediaStream([evt.track]);
           audioEl.play();
    }

    function updateParticipants(evt) {
        console.log("[PARTICIPANT(S) UPDATED]", evt);
        let el = document.getElementById("participants");
        let count = Object.entries(call.participants()).length;
        el.innerHTML = `Participant count: ${count}`;
    }

    function destroyTrack(evt) {
        console.log(
            "[TRACK STOPPED]",
              (evt.participant && evt.participant.session_id) || "[left meeting]"
            );
    
        let els = Array.from(document.getElementsByTagName("video")).concat(
              Array.from(document.getElementsByTagName("audio"))
            );
        for (let el of els) {
            if (el.srcObject && el.srcObject.getTracks()[0] === evt.track) {
                el.remove();
            }
        }
    }
    
    let call;

    useEffect(() => {
        const ROOM_URL = "https://tapv1.daily.co/zaq4sLeKAZphwowxj5NL";
        call = DailyIframe.createCallObject({
        url: ROOM_URL,
        // audioSource can be true, false, or a MediaStreamTrack object
        audioSource: true,
        videoSource: false,
        dailyConfig: {
          experimentalChromeVideoMuteLightOff: true
        }
      });

        call.on("joined-meeting", () => console.log("[JOINED MEETING]"));
        call.on("error", e => console.error(e));

        call.on("track-started", playTrack);
        call.on("track-stopped", destroyTrack);
        call.on("participant-joined", updateParticipants);
        call.on("participant-left", updateParticipants);


    });

    async function joinRoom() {
        await call.join();
    }

    async function leaveRoom() {
        await call.leave();
    }

  return <div id="local-controls">
      <button id="join" onClick={joinRoom}>join room</button>
     <hr />
     <button id="leave" onClick={leaveRoom}>leave room</button>
     <hr />
     {/* <button id="toggle-mic" onClick={call.setLocalAudio(!call.localAudio())}>
       toggle mic state
     </button> */}
     <hr />
     <div id="participants"></div>
  </div>;
}
