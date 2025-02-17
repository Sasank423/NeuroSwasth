import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./utils/AuthContext";

import Spinner from './styles/spinner'

import './styles/about.css';
import Header from "./header";


const featuresData = [
  {
    "feature": "AI-powered Chatbots",
    "description": "24/7 AI-driven chat assistance for health-related queries and guidance.",
    "img": "https://www.respeecher.com/hs-fs/hubfs/chatbot2-2.jpeg?width=1191&height=744&name=chatbot2-2.jpeg"
  },

  {
      "feature": "Personalized Alerts",
      "description": "Receive tailored health notifications based on your medical history and lifestyle.",
      "img": "https://www.infoprolearning.com/wp-content/uploads/2024/11/AI-Powered-Personalization-Transforming-the-Future-of-Learning-Through-MLS-without-logo.webp"
  },
  {
      "feature": "Secure Medical Record Databank",
      "description": "Store and access your medical records securely with encryption and cloud backup.",
      "img": "https://www.shutterstock.com/image-photo/artificial-intelligence-ai-healthcare-concept-600nw-2476602375.jpg"
  },
  {
      "feature": "Medical Report Analysis",
      "description": "AI-driven insights to help interpret your medical reports and suggest potential next steps.",
      "img": "https://www.wdxtechnologies.com/wp-content/uploads/2021/12/AI-healthcare-01.jpg"
  },
  {
      "feature": "Supplement Recommendations",
      "description": "Personalized supplement suggestions based on dietary needs and health goals.",
      "img": "https://www.shutterstock.com/image-photo/hand-touching-high-tech-global-600nw-2323228599.jpg"
  },
  {
      "feature": "Gamified Health Score",
      "description": "Track and improve your health through interactive goals and rewards.",
      "img": "https://img.freepik.com/free-vector/abstract-background-with-modern-halftone-dots-design_1048-13747.jpg"
  },
  {
      "feature": "Disease Prediction",
      "description": "AI-based early detection of potential health risks using medical data patterns.",
      "img": "https://img.freepik.com/premium-vector/corona-virus-3d-pathogen-covid-19-virus-infections-blue-background_90220-20.jpg"
  },
  {
      "feature": "Healthy Facility Finder",
      "description": "Locate nearby hospitals, clinics, and fitness centers based on your needs.",
      "img": "https://t4.ftcdn.net/jpg/03/01/46/11/360_F_301461106_EXXsPkG6yiOPO4Lb2mGyzNjkcWIg39w7.jpg"
  },
  {
      "feature": "School of Fundamentals",
      "description": "Access educational content on health, wellness, and medical fundamentals.",
      "img": "https://www.shutterstock.com/image-photo/hand-touching-high-tech-global-600nw-2323228599.jpg"
  },
  {
      "feature": "Online Medicine Shopping ",
      "description": "A centralized platform to compare and purchase medicines online.",
      "img": "https://www.wdxtechnologies.com/wp-content/uploads/2021/12/AI-healthcare-01.jpg"
  },
  {
      "feature": "PCOS Care",
      "description": "Specialized guidance and tracking tools for managing PCOS effectively.",
      "img": "https://www.shutterstock.com/image-photo/artificial-intelligence-ai-healthcare-concept-600nw-2476602375.jpg"
  },
  {
      "feature": "Calorie Tracker",
      "description": "Monitor your daily calorie intake and set personalized diet goals.",
      "img": "https://t4.ftcdn.net/jpg/03/01/46/11/360_F_301461106_EXXsPkG6yiOPO4Lb2mGyzNjkcWIg39w7.jpg"
  }
]


export default function Home() {

  const {getUsername,getProfilePic} = useAuth();
  const username = getUsername();
  const profilePic = getProfilePic();

  //const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delayMilliseconds = 1000;

    
    const timer = setTimeout(() => {
        setLoading(false);
    }, delayMilliseconds);

    
    return () => clearTimeout(timer);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const divRef = useRef(null);

  const getClassName = (index) => {
    if (index === currentIndex) return "carousel-slide active";
    if (index === (currentIndex - 1 + featuresData.length) % featuresData.length)
      return "carousel-slide prev";
    if (index === (currentIndex + 1) % featuresData.length)
      return "carousel-slide next";
    return "carousel-slide";
  };

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuresData.length);
        setIsTransitioning(false);
      }, 1000);
    }
  };

  const goToPrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? featuresData.length - 1 : prevIndex - 1
        );
        setIsTransitioning(false);
      }, 500);
    }
  };

  useEffect(() => {
    const goToNext = () => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % featuresData.length);
          setIsTransitioning(false);
        }, 1000);
      }
    };
    
    const interval = setInterval(goToNext, 3000);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, []);

  if(loading) {
    return <Spinner />; 
  }

  return (
    <div ref={divRef} tabIndex="0" onKeyDown={(e) => {if (e.key === 'ArrowRight') goToNext(); else if (e.key === 'ArrowLeft') goToPrev();}}>
        <Header />
        <div className="home-page">
          <div className="carousel">
            {featuresData.map((feature, index) => (
                <div
                  key={index}
                  className={getClassName(index)}
                  style={{ backgroundImage: `url(${feature.img})`, backgroundSize: "cover", backgroundPosition: "center" }}
                >
                  <div className="carousel-content">
                    <h2>{feature.feature}</h2>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))
            }
            <button className="carousel-btn left" onClick={goToPrev}>  ◀ </button>
            <button className="carousel-btn right" onClick={goToNext}>  ▶</button>
          </div>
          <h1>Welcome {username} !!!</h1>
          <img src={profilePic} alt="Uploaded Preview" />
          <section className="features">
              {featuresData.map((feature, index) => (
                  <div className="feature-item" key={index}>
                    <span className="feature-icon">📄</span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
              ))}
          </section>
        </div>
    </div>
  );
}
