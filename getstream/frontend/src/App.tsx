import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StreamProvider } from './contexts/StreamContext'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Feeds from './components/Feeds'
import Chat from './components/Chat'
import './App.css'

function App() {
  return (
    <StreamProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/feeds" element={<Feeds />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </main>
        </div>
      </Router>
    </StreamProvider>
  )
}

export default App
