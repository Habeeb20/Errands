import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Home1 from '../components/LandingPage/Home1'
import Home2 from '../components/LandingPage/Home2'
import Home3 from '../components/LandingPage/Home3'

const Home = () => {
  return (
    <div>
        <Navbar />
            <Home1 />
            <Home2 />
            <Home3 />
        <Footer />
      
    </div>
  )
}

export default Home
