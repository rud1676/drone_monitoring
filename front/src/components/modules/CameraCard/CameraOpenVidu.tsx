import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { OpenVidu, Session, Subscriber } from 'openvidu-browser';

import UserVideoComponent from '@/components/lib/UserVideoComponent';
import {
  OpenViduHeader,
  OpenViduSessionName,
  NoSignalBox,
} from './index.style';

// 데모서버로 할지, 배포된 URL로 할지
const APPLICATION_SERVER_URL = 'https://demos.openvidu.io/';

interface CameraOpenViduType {
  droneref: React.RefObject<string>;
}

const CameraOpenVidu = ({ droneref }: CameraOpenViduType) => {
  // 세션에 나 말고 접속된 유저들 받아오기. - 드론 카메라 한대만 받을예정
  const mySession = useRef<Session | null>(null);
  // 메인 카메라 - 드론 카메라 셋팅
  const [mainStreamManager, setMainStreamManager] = useState<Subscriber | null>(
    null,
  ); // 접속할 세션 이름
  const sessionName = `Session${droneref.current}`;
  // 이 세션에 접속할 이름 설정
  const myUserName = `카메라시청자${droneref.current}`;

  const leaveSession = () => {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    if (mySession.current) {
      mySession.current.disconnect();
    }

    // Empty all properties...
    setMainStreamManager(null);
  };

  const deleteSubscriber = () => {
    setMainStreamManager(null);
  };

  const createToken = async (sessionId: string) => {
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
    const sessionId = await createSession(sessionName);
    console.log(`${sessionId}에 연결합니다`);
    return createToken(sessionId);
  };

  const initSession = () => {
    const OV = new OpenVidu();
    // --- 2) Init a session ---
    const CurrentSession = OV.initSession();
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
    return CurrentSession;
  };

  const joinSession = async () => {
    try {
      mySession.current = initSession();
      // --- 4) Connect to the session with a valid user token ---
      const sessionId = await createSession(sessionName);
      console.log(`${sessionId}에 연결합니다`);
      const token = await createToken(sessionId);
      await mySession.current.connect(token, { clientData: myUserName });
    } catch (e: any) {
      console.error(
        'There was an error connecting to the session:',
        e.code,
        e.message,
      );
    }
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
              href={`https://demos.openvidu.io/openvidu-call/#/${sessionName}`}
              target="blank"
            >
              <OpenViduSessionName>{`${sessionName} 컴퓨터 테스트용 카메라 연결`}</OpenViduSessionName>
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
