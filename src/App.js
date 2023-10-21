import React, { useState } from 'react';
import './App.css';
import alarmSound from './alarm-clock-short-6402.mp3';
function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5*60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, settimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const breakAudio = new Audio(alarmSound);

  const playBreakSound=()=>{
    breakAudio.currentTime=0;
    breakAudio.play();
  }
  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return [minutes < 10 ? "0" + minutes : minutes] + ":" +
      (seconds < 10 ? "0" + seconds : seconds);
  }
const changeTime=(amount,type)=>{
  if(type==='break'){
    if(breakTime<=60 && amount<0){
      return
    }
    setBreakTime((prev)=>prev+amount)
  }else {
    if(sessionTime<=60 &&amount<0){
      return
    }
    setSessionTime((prev)=>prev+amount)
    if(!timerOn){
      setDisplayTime(sessionTime+amount)
    }
  }
}
const constroleTime = () => {
  let second = 1000;
  let date = new Date().getTime();
  let nextDate = new Date().getTime() + second;
  let onBreakVariable = onBreak;

  if (!timerOn) {
    let interval = setInterval(() => {
      date = new Date().getTime();
      if (date > nextDate) {
        setDisplayTime((prev) => {
          if(prev<=0 && !onBreakVariable){
            playBreakSound();
            onBreakVariable=true;
            setOnBreak(true);
            return breakTime;
          }else if(prev<=0 && onBreakVariable){
            playBreakSound();
            onBreakVariable=false;
            setOnBreak(false);
            return sessionTime;
          }
          return prev - 1;
        });
        nextDate += second;
      }
    }, 30);
    // Store the interval ID in local storage
    localStorage.clear();
    localStorage.setItem("interval-id", interval);
  }
  if (timerOn) {
    // Clear the interval using the stored interval ID
    clearInterval(parseInt(localStorage.getItem("interval-id")));
  }
  settimerOn(!timerOn);
};
const resetTime = ()=>{
  setDisplayTime(25*60)
  setBreakTime(5*60)
  setSessionTime(25*60)
}
  return (
    <div className="center-align">
      <h1> Pomodoro clock</h1>
      <div className='dual-container'>
        <Length title="Break Length" 
        changeTime={changeTime} 
        type="break" 
        time={breakTime} 
        formatTime={formatTime} />

        <Length title="session Length" 
        changeTime={changeTime} 
        type="session" 
        time={sessionTime} 
        formatTime={formatTime} />
      </div>

      <h2>{onBreak? "Breal": "Session"}</h2>
      <h1>{formatTime(displayTime)}</h1>

      <button className='btn-large deep-purple lighten-2' onClick={() => constroleTime()}>
        {timerOn ? (
          <i className='material-icons'>pause_circle_filled</i>
        ):(
          <i className='material-icons'>play_circle_filled</i>
        )}
      </button>
      <buttton className='btn-large deep-purple lighten-2' onClick={() => resetTime()}>
        <i className='material-icons'>autorenew</i>
      </buttton>
    </div>
  );
}

function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <div>
      <h3>{title}</h3>
      <div className='time-sets'>
        <button className='btn-small deep-purple lighten-2'
          onClick={()=>{changeTime(-60,type)}}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
      
      <h3>{formatTime(time)}</h3>
      <button className='btn-small deep-purple lighten-2'
      onClick={()=>{changeTime(+60,type)}}>
        <i className="material-icons">arrow_upward</i>
      </button>
      </div>
    </div>
  );
}

export default App;
