/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/rules-of-hooks */
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import UserVideoComponent from '../components/openVidu/UserVideoComponent';

// 데모서버로 할지, 배포된 URL로 할지
const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';

const videoTest = () => {
  // 접속할 세션 이름
  const [mySessionId, setMySessionId] = useState(
    `Session${Math.floor(Math.random() * 100)}`,
  );
  // 실제 세션 데이터
  const [session, setSession] = useState(undefined);
  // 메인 카메라 - 드론 카메라 셋팅
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  // 세션에 나 말고 접속된 유저들 받아오기. - 드론 카메라 한대만 받을예정
  const [subscribers, setSubscribers] = useState([]);

  let mySession = null;
  const myUserName = `카메라시청자${Math.floor(Math.random() * 100)}`;

  const leaveSession = useCallback(() => {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
  }, []);

  const onbeforeunload = useCallback(() => {
    leaveSession();
  }, [leaveSession]);

  useEffect(() => {
    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
    };
  }, [onbeforeunload]);

  const createToken = async sessionId => {
    const sendURL = `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`;
    const response = await axios.post(
      sendURL,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data; // The token
  };

  const createSession = async sessionId => {
    const sendURL = `${APPLICATION_SERVER_URL}api/sessions`;
    const res = await axios.post(
      sendURL,
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return res.data;
  };

  const getToken = useCallback(async () => {
    alert(`${mySessionId}에 연결합니다`);
    const sessionId = await createSession(mySessionId);
    return createToken(sessionId);
  }, [mySessionId, setMySessionId, createToken]);

  const handleChangeSessionId = useCallback(
    e => {
      setMySessionId(e.target.value);
    },
    [setMySessionId],
  );

  const deleteSubscriber = useCallback(() => {
    setMainStreamManager(undefined);
  }, [subscribers]);

  const joinSession = useCallback(
    e => {
      e.preventDefault();
      // --- 1) Get an OpenVidu object ---
      const OV = new OpenVidu();

      // --- 2) Init a session ---
      mySession = OV.initSession();
      setSession(mySession);
      // --- 3) Specify the actions when events take place in the session ---
      // On every new Stream received...
      mySession.on('streamCreated', event => {
        // 세션에 이미 연결된 다른사람을 발견할 때, 세션에 다른 사람이 연결 할 때 발생하는 이벤트.
        const subc = mySession.subscribe(event.stream, undefined);
        setMainStreamManager(subc);
      });

      // On every Stream destroyed...
      mySession.on('streamDestroyed', event => {
        // Remove the stream from 'subscribers' array
        deleteSubscriber(event.stream.streamManager);
      });

      // On every asynchronous exception...
      mySession.on('exception', exception => {
        console.warn(exception);
      });

      // --- 4) Connect to the session with a valid user token ---
      // Get a token from the OpenVidu deployment
      getToken().then(token => {
        // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
        // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
        mySession
          .connect(token, { clientData: myUserName })
          .then(async () => {
            // --- 5) Get your own camera stream ---
            // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
            // element: we will manage it on our own) and with the desired properties
            const publish = await OV.initPublisherAsync(undefined, {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: false, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: false, // Whether you want to start publishing with your video enabled or not
              resolution: '640x480', // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
              mirror: false, // Whether to mirror your local video or not
            });

            // --- 6) Publish your stream ---
            mySession.publish(publish);

            // Obtain the current video device in use
            // Set the main video in the page to display our webcam and store our Publisher
          })
          .catch(error => {
            console.error(
              'There was an error connecting to the session:',
              error.code,
              error.message,
            );
          });
      });
    },
    [getToken],
  );

  return (
    <div className="container">
      {session === undefined ? (
        <div id="join">
          <div id="join-dialog" className="jumbotron vertical-center">
            <h1> Join a video session </h1>
            <form className="form-group" onSubmit={joinSession}>
              <p>
                <label> Session: </label>
                <input
                  className="form-control"
                  type="text"
                  id="sessionId"
                  value={mySessionId}
                  onChange={handleChangeSessionId}
                  required
                />
              </p>
              <p className="text-center">
                <input
                  className="btn btn-lg btn-success"
                  name="commit"
                  type="submit"
                  value="JOIN"
                />
              </p>
            </form>
          </div>
        </div>
      ) : null}

      {session !== undefined ? (
        <div id="session">
          <div id="session-header">
            <h1 id="session-title">{mySessionId}</h1>
            <input
              className="btn btn-large btn-danger"
              type="button"
              id="buttonLeaveSession"
              onClick={leaveSession}
              value="Leave session"
            />
          </div>
          <a
            href={`https://demos.openvidu.io/openvidu-call/#/${mySessionId}`}
            target="blank"
          >
            카메라 세션 연결하기
          </a>

          {mainStreamManager !== undefined ? (
            <div id="main-video" className="col-md-6">
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default videoTest;
