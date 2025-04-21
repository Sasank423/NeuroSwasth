import React, { useState, useEffect } from "react";

import Header from "./header";

import './styles/ghs.css';
import { ChevronLeft, ChevronRight } from "lucide-react";

import { show_error, show_success } from "./utils/Alerts";
import { ToastContainer } from "react-toastify";

import { DNA } from "react-loader-spinner";


const Gauge = ({ value = 0 }) => {
    const [animatedValue, setAnimatedValue] = useState(0);
  
    useEffect(() => {
      // Reset to 0 when value changes
      setAnimatedValue(0);
      
      const animationDuration = 1500; // 1.5 seconds
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);
        
        setAnimatedValue(progress * value);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [value]);
  
    const clampValue = Math.max(0, Math.min(animatedValue, 1)); // Ensure value is between 0 and 1
    const rotation = `${clampValue / 2}turn`;
    const percentage = `${Math.round(clampValue * 100)}`;
  
    return (
      <div className="gauge" style={{ maxWidth: '400px' }}>
        <div className="gauge__body">
          <div
            className="gauge__fill"
            style={{ transform: `rotate(${rotation})` }}
          ></div>
          <div className="gauge__cover">{percentage}</div>
        </div>
      </div>
    );
  };
  

export default function Ghs() {

    const healthQs = [
        "Could you tell us about your current height and weight?",
        "How would you describe your breathing during normal daily activities?",
        "Have you or anyone else noticed any changes in your natural skin color, particularly looking more pale or washed out than usual?",
        "Have you observed any yellow coloring in your skin or the whites of your eyes?",
        "Have you seen any bluish or purplish discoloration in your lips, fingertips, or other areas?",
        "Have you noticed any changes in the shape of your fingernails or fingertips over time?",
        "Do you ever experience swelling in your feet, ankles, hands or face?",
        "What would you tell us is your typical body temperature, and have you noticed any patterns of running hotter or colder than normal?",
        "If you've ever checked your resting heart rate, what would you tell us it typically measures?",
        "How would you describe your normal breathing pattern when you're at complete rest?",
        "If you've had your blood pressure measured recently, what would you tell us were the numbers?",
        "How would you describe your typical bowel and bladder habits?",
        "What would you tell us a typical day's worth of meals and snacks looks like for you?",
        "How much water and other fluids would you say you typically consume in a day?",
        "What kinds of physical activity or exercise would you tell us you engage in regularly?",
        "How would you describe your typical sleep patterns to us?",
        "What significant health conditions would you tell us have been present in your immediate family members?",
        "How would you describe your current work environment and daily job demands to us?",
        "How would you characterize your typical stress levels to us?",
        "If you've ever tried holding your breath, how long would you tell us you're typically able to hold it comfortably?"
      ];

    const [ips, setIPS] = useState([
      "I'm 5'5\" and weigh 250 pounds.",
      "I get out of breath just walking up the stairs.",
      "My skin looks really pale and washed out lately.",
      "I’ve noticed yellowing in my skin and eyes, especially in the mornings.",
      "My lips and fingertips often turn bluish, especially when it's cold.",
      "My fingernails have become soft and brittle, and I’ve noticed a few changes in their shape.",
      "I have swelling in my feet and hands pretty much every evening.",
      "I feel unusually cold all the time, even when others are comfortable.",
      "I don't check my resting heart rate, but I feel like it's faster than normal.",
      "I tend to breathe heavily even when I'm resting, like after doing simple tasks.",
      "My blood pressure has been high, around 145/95, and my doctor is concerned about it.",
      "I have irregular bowel movements and sometimes feel constipated.",
      "I skip meals regularly and often grab unhealthy snacks like chips and candy.",
      "I drink only 2-3 cups of water a day, and I often forget to hydrate.",
      "I don’t really exercise, and I spend most of my time sitting at a desk.",
      "I sleep about 4-5 hours a night and wake up feeling exhausted.",
      "I have a family history of heart disease, stroke, and high cholesterol.",
      "My job is very stressful, and I often work late into the night.",
      "I experience high levels of stress almost every day and find it hard to manage.",
      "I can only hold my breath for about 10 seconds before I start feeling uncomfortable."
  ]
  )

    const [i, setI] = useState(0);

    const [shift, setShift] = useState(false);
    const [score, setScore] = useState(0);

    const [load, setLoad] = useState(false);
      
    const handleInput = (e) => {
        let t = [...ips];
        t[i] = e.target.value;
        setIPS(t);
    }

    const handleSubmit = async () => {
      let a = ''
      for(let j=0;j<20;j++){
        if(ips[j] === ''){
          a += (j+1) +' '
        }
      }
      if(a.length !== 0){
        show_error(`Please answer Questions ${a}!!!`);
        return;
      } else{
        setShift(true);
        setLoad(true);
        try {
          const res = await fetch('/api/cal/score', {
              method : 'POST', 
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 'data' : ips }),
          });
  
          const dat = await res.json();
          if(dat) {
              setScore(dat.score)
              show_success('succesfully calculated')
          }
          setLoad(false);
        } catch(e) {
          show_error('Unable to process');
        }
        setLoad(false);
      }
      
    }


    return <>
        <Header comp={'Gamified Health Score'}/>
        <div className="ghsmain">
            {shift ?<div className="ghsguage">
              {load ? <div className="ghsload"> <DNA
                      visible={true}
                      height="150"
                      width="200"
                      ariaLabel="dna-loading"
                      wrapperStyle={{}}
                      wrapperClass="dna-wrapper"
                      /> </div>:
                <>
                  <h1>Result :</h1>
                  <Gauge value={score} />
                </>
              }
            </div>:
            <div className="ghsqs">
                <div className="ghsqscont">
                    <label>{i+1}. {healthQs[i]}</label>
                    <input type="text" value={ips[i]} onChange={(e) => handleInput(e)}></input>
                </div>
                <div className="ghsnbbtn">
                    <button onClick={() => {i > 0  ? setI(i-1) : setI(19)}}><ChevronLeft /></button>
                    <button className="ghssubmit" onClick={handleSubmit}>Calculate</button>
                    <button onClick={() => {i < 19 ? setI(i+1) : setI(0)}}><ChevronRight /></button>
                </div>
            </div>}
        </div>
        <ToastContainer />
    </>
}