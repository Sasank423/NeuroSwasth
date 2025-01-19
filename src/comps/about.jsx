import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './styles/about.css';

import medrec from './props/medical_record.jpg';
import gam from './props/gamafied_score.jpg';
import rep from './props/report.jpg';
import sup from './props/supplement.jpg';

const featuresData = [
  {
    title: "Medical Records",
    description: "Securely manage your medical records in one place.",
    image: medrec,
  },
  {
    title: "Supplement",
    description: "Get personalized supplements based on your needs.",
    image: sup,
  },
  {
    title: "Medical Report",
    description: "Analyze your medical reports for better insights.",
    image: rep,
  },
  {
    title: "Gamified Health Score",
    description: "Track your health score and compete globally.",
    image: gam,
  }
];

export default function About() {

  const nav = useNavigate();

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
    const interval = setInterval(goToNext, 3000);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, []);

  return (
    <div ref={divRef} tabIndex="0" onKeyDown={(e) => {if (e.key === 'ArrowRight') goToNext(); else if (e.key === 'ArrowLeft') goToPrev();}}>
        <div className="header">
          <div className="title">
            <h1>NeuroSwasth</h1>
          </div>
          <div className="auth-buttons">
            <button className="auth-btn" onClick={() => nav('/login')}>Login</button>
            <button className="auth-btn" onClick={() => nav('/signup')}>Sign Up</button>
          </div>
        </div>
        <div className="home-page">
          <div className="carousel">
            {featuresData.map((feature, index) => (
                <div
                  key={index}
                  className={getClassName(index)}
                  style={{ backgroundImage: `url(${feature.image})` }}
                >
                  <div className="carousel-content">
                    <h2>{feature.title}</h2>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))
            }
            <button className="carousel-btn left" onClick={goToPrev}>  ◀ </button>
            <button className="carousel-btn right" onClick={goToNext}>  ▶</button>
          </div>
          
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
