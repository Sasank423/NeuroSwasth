import React, { useState } from "react";
import { Search, Star } from "lucide-react";
import Header from "./header";
import "./styles/mff.css";

import { DNA } from 'react-loader-spinner';


export default function Mff() {

  const [flip, setFlip] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null); // Track which item is hovered
  const [hosps, setHosps] = useState([]);
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async () => {
    setFlip(true);
    setHosps([]);
    try {
      const res = await fetch('/api/get/hosps', {
          method : 'POST', 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if(data) {
        setHosps(data);
      }
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <>
      <Header comp="Medical Facility Finder" />
      <div className="mffmain_box">
        <div className="mffip">
          <label>Enter the type of Hospital You want to find :</label>
          <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
          <button onClick={handleSubmit}>
            <Search />
          </button>
        </div>
        {flip && (
                  <div className="mffop">
                    {hosps.length === 0 ? (
                      <div className="mffload">
                        <DNA
                          visible={true}
                          height="150"
                          width="200"
                          ariaLabel="dna-loading"
                          wrapperStyle={{}}
                          wrapperClass="dna-wrapper"
                        />
                      </div>
                    ) : (
                      hosps.map((hsp, i) => (
                        <div
                          key={i}
                          onMouseEnter={() => setHoverIndex(i)}
                          onMouseLeave={() => setHoverIndex(null)}
                          className="mffopitem"
                        >
                          <img
                            className={hoverIndex === i ? "mffhovered" : ""}
                            src={hsp.img}
                            alt="img"
                          />
                          <div className={hoverIndex === i ? "mffinfohovered" : "mffinfo"}>
                            <label>{hsp.name}</label>
                          </div>
                          <div className={hoverIndex === i ? "mffrathovered" : "mffrat"}>
                            <Star />
                            <label>{hsp.rating}</label>
                          </div>
                          {hoverIndex === i && (
                            <a href={hsp.url} target="_blank" rel="noopener noreferrer">
                              <div className="mffredir">Explore</div>
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

      </div>
    </>
  );
}
