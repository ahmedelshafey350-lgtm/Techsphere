import React from 'react'
import Intro from '../Intro/Intro'
import Cardcourses from '../Cards/Card'
import Who_us from '../Whous/Who_us'
import PageFeedback from '../Feedback/PageFeedback'
import Question from '../Question/Question'
import Contact from '../Contactus/contact'
import Footer from '../Footer/Footer'

function Home() {
  return (
    <>
      <Intro />
      <Cardcourses />
      <Who_us />
      <PageFeedback />
      <Question />
      <Contact />
      <Footer />
    </>
  )
}

export default Home
