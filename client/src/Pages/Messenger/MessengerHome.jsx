import React from 'react'
import AllMessenger from '../../components/E_Messenger/AllMessenger'
import Messenger from '../../components/E_Messenger/Messenger1'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Home2 from '../../components/LandingPage/Home2'
import Home3 from '../../components/LandingPage/Home3'
import MessengerHomePart from '../../components/E_Messenger/MessengerHomePart'

const MessengerHome = () => {
  return (
    <div>
        <>
        <Navbar />
        <Messenger />
        <MessengerHomePart />
        <AllMessenger />
        
        <Footer />
        </>
   
    </div>
  )
}

export default MessengerHome
