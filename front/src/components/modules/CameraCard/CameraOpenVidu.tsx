import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { OpenVidu, Session, Subscriber } from 'openvidu-browser';

import UserVideoComponent from '@/components/lib/openVidu/UserVideoComponent';
import {
  OpenViduHeader,
  OpenViduSessionName,
  NoSignalBox,
} from './index.style';

// 데모서버로 할지, 배포된 URL로 할지
const APPLICATION_SERVER_URL = 'https://demos.openvidu.io/';

interface CameraOpenViduType {
  mySessionId: string;
}

const CameraOpenVidu = ({ mySessionId }: CameraOpenViduType) => {
  // 접속할 세션 이름
  mySessionId = `Session${Math.floor(Math.random() * 100)}`;
  // 이 세션에 접속할 이름 설정
  const myUserName = `카메라시청자${Math.floor(Math.random() * 100)}`;

  // 세션에 나 말고 접속된 유저들 받아오기. - 드론 카메라 한대만 받을예정
  const mySession = useRef<Session | null>(null);
  // 메인 카메라 - 드론 카메라 셋팅
  const [mainStreamManager, setMainStreamManager] = useState<Subscriber | null>(
    null,
  );

  const leaveSession = () => {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    if (mySession.current) {
      mySession.current.disconnect();
    }

    // Empty all properties...
    setMainStreamManager(null);
  };

  const createToken = useCallback(async (sessionId: string) => {
    const sendURL = `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`;
    const response = await axios.post(
      sendURL,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data; // The token
  }, []);

  const createSession = async (sessionId: string) => {
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

  const getToken = async () => {
    // console.log(`${mySessionId}에 연결합니다`);
    const sessionId = await createSession(mySessionId);
    console.log(`${sessionId}에 연결합니다`);
    return createToken(sessionId);
  };

  const deleteSubscriber = () => {
    setMainStreamManager(null);
  };

  const joinSession = () => {
    // --- 1) Get an OpenVidu object ---
    const OV = new OpenVidu();

    // --- 2) Init a session ---
    mySession.current = OV.initSession();
    const CurrentSession = mySession.current;
    // --- 3) Specify the actions when events take place in the session ---
    // 세션에 이미 연결된 다른사람을 발견할 때, 세션에 다른 사람이 연결 할 때 발생하는 이벤트.
    CurrentSession.on('streamCreated', event => {
      const subc = CurrentSession.subscribe(event.stream, undefined);
      setMainStreamManager(subc);
    });

    // 세션에 다른사람 카메라 연결이 끊어졌을 때 발생
    CurrentSession.on('streamDestroyed', () => {
      deleteSubscriber();
    });

    // On every asynchronous exception...
    CurrentSession.on('exception', exception => {
      // eslint-disable
      console.warn(exception);
    });

    // --- 4) Connect to the session with a valid user token ---
    getToken().then(token => {
      CurrentSession.connect(token, { clientData: myUserName })
        .then(async () => {
          const publish = await OV.initPublisherAsync(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: false, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: undefined, // Whether you want to start publishing with your video enabled or not
            resolution: '640x480', // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          // --- 6) Publish your stream ---
          CurrentSession.publish(publish);
        })
        .catch(error => {
          console.error(
            'There was an error connecting to the session:',
            error.code,
            error.message,
          );
        });
    });
  };

  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession);
    joinSession();
    return () => {
      leaveSession();
      window.removeEventListener('beforeunload', leaveSession);
    };
  }, []);

  return (
    <div>
      {mySession.current !== undefined ? (
        <div>
          <OpenViduHeader>
            <a
              href={`https://demos.openvidu.io/openvidu-call/#/${mySessionId}`}
              target="blank"
            >
              <OpenViduSessionName>{`${mySessionId} 컴퓨터 테스트용 카메라 연결`}</OpenViduSessionName>
            </a>
          </OpenViduHeader>
          {mainStreamManager !== null ? (
            <div id="main-video" className="col-md-5">
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          ) : (
            <NoSignalBox>No Signal</NoSignalBox>
          )}
        </div>
      ) : (
        <NoSignalBox>No Signal</NoSignalBox>
      )}
    </div>
  );
};

export default React.memo(CameraOpenVidu);
