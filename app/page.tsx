'use client'

import ChatsRoom from './chatroom/page'
import SetName from './setname/page'
import {HashRouter as Router,Routes,Route} from'react-router-dom'

function App(){
  return(
    <Router>
      <Routes>
        <Route path='/' element={<SetName />}/>
        <Route path='/chatsroom' element={<ChatsRoom />} />
      </Routes>
    </Router>
  )
}

export default App;