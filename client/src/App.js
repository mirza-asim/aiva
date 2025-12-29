import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function App() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);


  const handleSubmit = async (e)=> {
    
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMessage = { role: "user", text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
   try {

    const res = await axios.post("/api/ask", {inputValue})
    .then((res)=>res.data)
    .then((finalRes)=>{
      console.log("FINAL-RES = ", finalRes);
      if(finalRes._status){
        console.log("FINAL-STATUS = " + finalRes._status);
        console.log("FINAL-RES._finalData = ", finalRes._role);
        setMessages(prev => [...prev, { role: "model", text: finalRes._text } ]);
      }
    })
  } catch (err) {
    if (err.response?.status === 429) {
    setMessages(prev => [
      ...prev,
      {
        role: "system",
        text: "⚠️ Prompt Rate limit reached. Please try again later.",
      },
    ]);
  } else {
    setMessages(prev => [
      ...prev,
      {
        role: "system",
        text: "❌ Something went wrong.",
      },
    ]);
  }
  }

  };

  
  return (
    <div className="App">
      <header className="App-header">
        <ul className="chat">
          {messages.map((msg, i) => (
            <li
              key={i}
              className={msg.role === "user" ? "user" : "model"}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </li>
          ))}
        </ul>

        <div className="input-area"> 
          <form className="input-area" onSubmit={handleSubmit}>
            <input value={inputValue} onChange={(e)=> setInputValue(e.target.value)} placeholder="Start Mashing buttons here!" type="text"></input>
            <button type='Submit'>Send</button>
            </form>
        </div>
      </header>
    </div>
  );
}

export default App;
