import './App.css'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing';
import Chat from './pages/Chat';
import { useState } from 'react';

function App() {

  const [ usermame, setUsername ] = useState('')
  const [ room, setRoom ] = useState(null)

  return (
    <>
        <Routes>
          <Route path='/' element={ <Landing setUsername={setUsername} setRoom={setRoom}/> }/>
          <Route path='/chat' element={ <Chat username={usermame} room={room}/> }/>
        </Routes>
    </>
  )
}

export default App
