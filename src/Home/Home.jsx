import React from 'react'
import Intro from '../Intro/Intro'
import Cardcourses from '../Cards/Card'
import Who_us from '../Whous/Who_us'
import PageFeedback from '../Feedback/PageFeedback'
import Question from '../Question/Question'
import Contact from '../Contactus/contact'
import ProjectShowcase from '../Projects/ProjectShowcase'
import { useLanguage } from '../i18n/language';

function Home() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  return (
    <main className="home-page" dir={isEnglish ? "ltr" : "rtl"}>
      <Intro />
      <Cardcourses />
      <ProjectShowcase />
      <Who_us />
      <PageFeedback />
      <Question />
      <Contact />
    </main>
  )
}

export default Home
