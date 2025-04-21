import React, { useState } from "react";

import './styles/srs.css';
import Header from "./header";

import { DNA } from "react-loader-spinner";

export default function Srs() {

    const activityLevels = [
        "Sedentary",
        "Lightly Active",
        "Moderately Active",
        "Very Active",
        "Extremely Active"
      ];
      
      const dietaryPreferences = [
        "Vegetarian",
        "Keto",
        "Gluten Free",
        "Low Carb",
        "Dairy Free"
      ];
      
      const fitnessGoals = [
        "Lose Weight",
        "Gain Muscle",
        "Endurance",
        "Stay Fit",
        "Strength Training"
      ];

    const [age, setAge] = useState(21);
    const [weight, setWeight] = useState(98);
    const [height, setHeight] = useState(5.11);
    const [al, setAL] = useState(0);
    const [dp, setDP] = useState(0);
    const [fg, setFG] = useState(0);

    const [op, setOP] = useState('');

    const [shift, setShift] = useState(false);
    const [load, setLoad] = useState(false);

    const handleSubmit = async () => {
        setShift(true);
        setLoad(true);
        const d = {
            "age": age,
            "height": height,
            "weight": weight,
            "activity_level": activityLevels[al],
            "dietary_preferences": dietaryPreferences[dp],
            "fitness_goals": fitnessGoals[fg],
            'sex' : 'male'
        }

        try {
            const res = await fetch('/api/get/supp', {
                method : 'POST', 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ d }),
            });
      
            const data = await res.json();
            if(data) {
              setOP(data.res);
            }
          } catch(e) {
            console.error(e);
          }
          setLoad(false)
    }

    if(shift) {
        return <>
            <Header comp={"Supplement Recommendation System"}/>
            <div className="srsmain">
                {load ? <div className="sum_spin"><DNA
                        visible={true}
                        height="150"
                        width="200"
                        ariaLabel="dna-loading"
                        wrapperStyle={{}}
                        wrapperClass="dna-wrapper"
                        /></div>:
                    <div
                    className="sum_op_box"
                    dangerouslySetInnerHTML={{ __html: op }}
                    ></div>
                }
            </div>
        </>
    }

    return (<>
        <Header comp={'Suplement Recommendation System'}/>
        <div className="srsmain">
        <h2>Provide your health information for precise supplement matching</h2>
            <div className="srsbox">
                <div className="srsnumip">
                    <div className="srsip">
                        <label>Age :</label>
                        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                    </div>
                    <div className="srsip">
                        <label>Weight :</label>
                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>
                    <div className="srsip">
                        <label>Height :</label>
                        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                    </div>
                </div>
                <div className="srsnumip">
                    <div className="srsip">
                        <label>Activity Level:</label>
                        <select value={al} onChange={(e) => setAL(Number(e.target.value))}>
                        <option value="" disabled>Select activity level</option>
                        {activityLevels.map((level, i) => (
                            <option key={i} value={i}>{level}</option>
                        ))}
                        </select>
                    </div>
                    <div className="srsip">
                        <label>Dietary Preference:</label>
                        <select value={dp} onChange={(e) => setDP(Number(e.target.value))}>
                        <option value="" disabled>Select dietary preference</option>
                        {dietaryPreferences.map((pref, i) => (
                            <option key={i} value={i}>{pref}</option>
                        ))}
                        </select>
                    </div>
                    <div className="srsip">
                        <label>Fitness Goal:</label>
                        <select value={fg} onChange={(e) => setFG(Number(e.target.value))}>
                        <option value="" disabled>Select fitness goal</option>
                        {fitnessGoals.map((goal, i) => (
                            <option key={i} value={i}>{goal}</option>
                        ))}
                        </select>
                    </div>
                </div>
                <button className="srsbtn" onClick={handleSubmit}>Process</button>
            </div>
            
        </div>
    </>)
}