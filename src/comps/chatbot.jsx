import React,{useEffect, useState} from "react";
import { Paperclip, SendHorizontalIcon, X } from "lucide-react";

import Header from "./header";
import neph from './props/chatboticons/nephrology.jpg';
import gyna from './props/chatboticons/Gynaecology.jpg';
import pedi from './props/chatboticons/Pediatrician.jpg';

import './styles/chatbot.css';

const chatbots = [
    {
        name : 'Nephrology', 
        description : 'Expert in nephrology, including dialysis, kidney transplantation, and kidney disease management.',
        image : neph
    }, 
    {
        name : 'Gynaecology',
        description : 'Expert in gynaecology, including obstetrics, gynecological oncology, and endometrial cancer screening.',
        image : gyna
    },
    {
        name : 'Pediatrication',
        description : 'Expert in pediatric care, including diabetes, hypertension, and mental health conditions.',
        image : pedi
    }
]

export default function Chatbot() {

    const [images, setImages] = useState([]);
    const [msg,setMsg] = useState('');
    const [current,setCurrent] = useState(chatbots[0]);

    const [botmsg, setBotMsg] = useState([]);
    const [usermsg, setUserMsg] = useState([]);
    const [processing,setProcessing] = useState(false);

    useEffect(() => {
            setBotMsg([`Welcome to our chatbot! Our expertise includes ${current.description}`]);
            setUserMsg([]);
    },[current]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...imageUrls]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setUserMsg((prev) => [...prev, msg]);
        setMsg('');
        await sleep(3000);
        setBotMsg((prev) => [...prev, `Done processing`]);
        setProcessing(false);
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    return (
        <>
            <Header comp={'ChatBot'}/>
            <div className="mainbox">
                <div className="sidebar">
                    <div className="image">
                        <img src={current.image} alt={current.name} />
                    </div>
                    <div className="chatbotnames">
                        {chatbots.map((chatbot, index) => (
                            <div onClick={() => setCurrent(chatbots[index])} key={index} className="chatbot-item">
                                <img src={chatbot.image} alt={chatbot.name} />
                                <h3>{chatbot.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="msgbox">
                    <div className="descbox">
                        <img src={current.image} alt={current.name} />
                        <label>{current.name}</label>
                    </div>
                    <div className="chatarea">
                        {Array.from({ length: Math.max(botmsg.length, usermsg.length) }).map((_, index) => (
                            <div key={index}>
                                {botmsg[index] && <div className="botmsg"><p>{botmsg[index]}</p></div>}
                                {usermsg[index] && <div className="usermsg"><p>{usermsg[index]}</p></div>}
                            </div>
                        ))}
                        {processing && 
                            <div className="botmsgload">
                                <div className="typing">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        }
                    </div>
                    {images.length > 0 && (
                        <div className="image-preview">
                            {images.map((img, index) => (
                                <div key={index} className="preview-item">
                                    <img src={img} alt="preview" />
                                    <button className="remove-btn" onClick={() => removeImage(index)}>
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="inputbox">
                            <div>
                                <input type="file" accept="image/*" multiple onChange={handleImageUpload} id="fileInput" hidden />
                                <Paperclip onClick={() => document.getElementById("fileInput").click()} />
                                <textarea
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) { 
                                            e.preventDefault();
                                            document.getElementById("sbutt").click();
                                        }
                                    }}
                                    placeholder="Type a message..."
                                />
                                <button type="submit" id="sbutt"><SendHorizontalIcon /></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}