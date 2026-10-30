import React, { useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import '../About/About.css'
import articles from './Detalis'
import { motion } from "framer-motion"
const MotionCard = motion(Card);
import '../Cards/card.css'
import Footer from '../Footer/Footer'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useLanguage } from '../i18n/language';
function Articals() {
    const [datalis] = useState(articles)
    const history = useHistory();
    const { language } = useLanguage();
    function GetLink(id) {
        history.push(`/articalis/${id}`)
    }
    return (
        <>
            <div className='contentAbout2'>
                <div className='ggg'>
                    <h1>{language === 'en' ? 'Learn with Techsphere' : <>تعلّم مع <bdi dir="ltr">Techsphere</bdi></>}</h1>
                    <p>{language === 'en' ? 'Discover educational articles on programming, artificial intelligence, technology, and career development. At Techsphere, we help you understand the latest technical skills and take clearer steps toward the job market.' : 'اكتشف مقالات تعليمية متخصصة في البرمجة، والذكاء الاصطناعي، والتكنولوجيا، وتطوير المسار المهني. نساعدك في تيك اسفير على فهم أحدث المهارات التقنية واتخاذ خطوات أوضح نحو سوق العمل.'}</p>
                </div>
            </div>
            <div className='Cards articleCards'>
                {datalis.map((course) => (
                    <MotionCard key={course.id}
                        className='articleCard'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, amount: 0.3 }}
                        sx={{ width: '100%', maxWidth: 345  }}>

                        <CardMedia
                            component="img"
                            height="200"
                            image={course.image}
                            alt={language === 'en' ? course.titleEn : course.name}
                        />

                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {language === 'en' ? course.titleEn : course.title}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {language === 'en' ? course.paragraphEn : course.paragraph}
                            </Typography>
                        </CardContent>
                        <button className='btnsubscription' onClick={()=>{GetLink(course.id)}}>{language === 'en' ? 'Read article' : ' قراءه المقال'}</button>

                    </MotionCard>
                ))}
            </div>
            <Footer/>
        </>
    )
}

export default Articals
