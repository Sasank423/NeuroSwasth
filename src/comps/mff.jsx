import React, { useState } from "react";
import { Search, Star } from "lucide-react";
import Header from "./header";
import img from "./props/hosp.png";
import "./styles/mff.css";

export default function Mff() {
  const hospitals = [
    {
      name: "V Cardiac and Multi Speciality Hospital",
      rating: "3.6",
      img: img,
      url: "https://www.google.com/maps/place/V+Cardiac+and+Multi+Speciality+Hospital/@16.236272,43.7363194,4z/data=!4m10!1m2!2m1!1scaridology+hosptials+near+me!3m6!1s0x3a4a060a313fa055:0x10864f264e0cb5a4!8m2!3d16.236272!4d80.6503819!15sChxjYXJkaW9sb2d5IGhvc3BpdGFscyBuZWFyIG1lIgOQAQGSAQxjYXJkaW9sb2dpc3TgAQA!16s%2Fg%2F11cjqqmk7_?entry=ttu&g_ep=EgoyMDI1MDMxOC4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D",
    }
  ];

  const [flip, setFlip] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null); // Track which item is hovered

  return (
    <>
      <Header comp="Medical Facility Finder" />
      <div className="mffmain_box">
        <div className="mffip">
          <label>Enter the type of Hospital You want to find :</label>
          <input type="text" />
          <button onClick={() => setFlip(true)}>
            <Search />
          </button>
        </div>
        {flip && (
          <div className="mffop">
            {hospitals.map((hsp, i) => (
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
            ))}
          </div>
        )}
      </div>
    </>
  );
}
