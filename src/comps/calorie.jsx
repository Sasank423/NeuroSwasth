import React, { useEffect, useState } from "react";
import Header from "./header";

import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import { ChevronLeft, ChevronRight, SquareChartGantt } from "lucide-react";

import "./styles/calorie.css";

const COLORS = ['#27445D','#497D74','#71BBB2','#EFE9D5']


const ConsumptionBarChart = ({data,value}) => {
  return (
    <div className="trkbar">
      <BarChart
        width={1200}
        height={500}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={value} fill="white" />
      </BarChart>
    </div>
  );
};

const AnalysisPieChart = ({data}) => {
    return (
      <div className="trop_pie">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            label
            outerRadius={130}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    );
  };
  



export default function Tracker() {

    const [shift, setShift] = useState(false);
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState(null);

    const [item, setItem] = useState('');
    const [data,setData] = useState([
        { name: 'Protien', value: 40 },
        { name: 'Calcium', value: 30 },
        { name: 'Fat', value: 30 },
        { name: 'Carbohydrates', value: 10 },
      ])

    const [bardata, setBarData] = useState({});

    const [charts, setCharts] = useState(false);

    const fields = ['Carbohydrates', 'Protien', 'Calcium', 'Fats']
    const [cur, setCur] = useState(0)


    const handleSubmit = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/analyse/calorie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ img : image }),
        });

        const data = await response.json();
        if (data){
            setData(data.data);
            setShift(true);
            setItem(data.item);
        } 
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    }

    const handleFileChange = (event) => {
        console.log(image);
        const file = event.target.files[0];
        if (file) {
          setImage(file);
          setPreview(URL.createObjectURL(file));
        }
    };



    useEffect(() => {
      const getConsumptionData = async () => {
        try {
          const res = await fetch('http://127.0.0.1:5000/get/consumption', {
              method : 'POST', 
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 'data' : cur }),
          });

          const data = await res.json();
          if(data) {
            setBarData(data)
          }
        } catch(e) {
          console.error(e);
        }
    }
      if(charts){
        getConsumptionData();
      }
    }, [charts,cur]);
    

    if (charts){

      return(
          <>
            <Header comp='Calorie Tracker'/>
            <div className="trakmain">
                  <button title="BarCharts" onClick={() => setCharts(!charts)} className="trkgantcharts"><ChevronLeft size={30} /></button>
                  <button className="trkbtn" onClick={() => {if(cur > 0) {setCur(cur-1)} else {setCur(3)}}}><ChevronLeft size={30}/></button>
                  <div className="trkbargrph"><ConsumptionBarChart data={bardata[fields[cur]]} value={fields[cur]}/></div>
                  <button className="trkbtn" onClick={() => {if(cur<3) {setCur(cur+1)} else {setCur(0)}}}><ChevronRight size={30}/></button>
            </div>
          </>);
    }

    return (
        <>
            <Header comp='Calorie Tracker'/>
            <div className="trakmain">
                <button title="BarCharts" onClick={() => setCharts(!charts)} className="trkgantcharts"><SquareChartGantt size={30} /></button>
                <div className="trip">
                    <div className="tripcont">
                        <input id='trdoc' type='file' accept='images/*' onChange={handleFileChange} style={{'display':'none'}}/>
                        {preview && <img src={preview} alt="profilepic" />}
                        <div className="tkupbut"><label htmlFor='trdoc'>Upload Image</label></div>
                    </div>
                    <button onClick={handleSubmit}>Analyse</button>
                </div>
                { shift &&
                <div className="trop">
                    <h2>Analysis Report</h2>
                    <label><b>Item Name :</b> {item}</label>
                    <AnalysisPieChart data={data} />
                    <button className="tropadd">Add to Consumption</button>
                </div>
                }
            </div>
        </>
    );
}