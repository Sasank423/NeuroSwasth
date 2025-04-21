import React,{useEffect, useState} from "react";
import { Paperclip, SendHorizontalIcon, X } from "lucide-react";

import Header from "./header";
import neph from './props/chatboticons/nephrology.jpg';
import gyna from './props/chatboticons/Gynaecology.jpg';
import pedi from './props/chatboticons/Pediatrician.jpg';
import gas from './props/chatboticons/gastrology.jpg';
import neuro from './props/chatboticons/neurology.jpeg';
import pulm from './props/chatboticons/pulmenology.jpeg';
import cardio from './props/chatboticons/cardiology.jpeg';

import './styles/chatbot.css';

const chatbots = [
    {
        id : 0,
        name : 'Gynaecologist',
        description : "Hi, I’m GynoCare AI, your gynecology assistant. I’m here to help you with any women's reproductive health-related concerns. Can you tell me your name, age, and gender?",
        image : gyna
    },
    {
        id : 1,
        name : 'Gastrologist',
        description : "Hi, I’m GastroAssist AI, your gastroenterology assistant. I’m here to help you with any digestive system-related concerns. Can you tell me your name, age, and gender?",
        image : gas
    },
    {
        id : 2,
        name : 'Neurologist',
        description : "Hi, I’m NeuroAssist AI, your neurology assistant. I’m here to help you with any brain, spine, or nervous system-related concerns. Can you tell me your name, age, and gender?",
        image : neuro
    },
    {
        id : 3,
        name : 'Pediatrication',
        description : "Hi, I’m PediCare AI, your pediatric assistant. I’m here to help you with any concerns about your child's health. Can you tell me your child's name, age, and gender?",
        image : pedi
    },
    {
        id : 4,
        name : 'Nephrology', 
        description : "Hi, I’m NephroAssist AI, your nephrology assistant. I’m here to help you with any kidney or renal-related concerns. Can you tell me your name, age, and gender?",
        image : neph
    }, 
    {
        id : 5,
        name : 'Pulmonologist',
        description : "Hi, I’m PulmoCare AI, your pulmonology assistant. I’m here to help you with any lung or breathing-related concerns. Can you tell me your name, age, and gender?",
        image : pulm
    },
    {
        id : 6,
        name : 'Cardiologist',
        description : "Hi, I’m CardioConsult AI, your cardiology assistant. I’m here to help you with any heart-related concerns. Can you tell me your name, age, and gender?",
        image : cardio
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
            const change = async () => {
                try {
                    const response = await fetch('/api/set/bot', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id : current.id
                        }),
                    });
                    const data = await response.json();
                    console.log(data);
                    
                } catch (e) {
                    console.error('Error:', e);
                }
            }

            const getHist = async () => {
                try {
                    const response = await fetch('/api/get/hist', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: current.id})
                      });
                      
                      const data = await response.json();
                      if(data.status === 'ok'){
                        setBotMsg([current.description,...data.reply]);
                        setUserMsg(data.user);
                      } else {
                        setBotMsg([`${current.description}`]);
                        setUserMsg([]);
                      }
                      
                } catch (error) {
                    alert(error.message);
                }
            }
            setBotMsg([current.description])
            setUserMsg([])
            change();
            getHist();           

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
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    msg: msg
                }),
            });
            const data = await response.json();
            setBotMsg((prev) => [...prev, data.reply]);
        } catch (e) {
            console.error('Error:', e);
        }
        
        setProcessing(false);
    }

    //const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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