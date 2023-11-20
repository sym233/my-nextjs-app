'use client';

import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useSessionStore } from '@/store';

const InputArea = () => {
  const [inputUsername, setInputUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout, username, failure } = useSessionStore(
    useShallow(({ failure, username, login, logout }) => ({
      failure,
      username,
      login,
      logout,
    }))
  );

  const submit = () => {
    login(inputUsername, password);
  };

  return (
    <div className="border border-black border-solid p-4">
      {failure && <p>Message: {failure}</p>}
      {username ?
        (<>
          <p>Successfully Logged in as {username}</p>
          <button onClick={logout}>Log Out</button>
        </>) :
        (<div>
          <div>
            <input
              placeholder="username"
              value={inputUsername}
              onChange={e => setInputUsername(e.target.value)}
            />
          </div>
          <div>
            <input placeholder="password" type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button className="border border-gray border-solid p-1" onClick={submit} disabled={!inputUsername || !password}>OK</button>
          </div>
        </div>)}
    </div>
  );
};

export default InputArea;
