import "./Tambola.css";
import React, { useState, useEffect } from 'react';

const TambolaGame = () => {
    const [numbersCalled, setNumbersCalled] = useState(() => {
        const getNumberCalled = localStorage.getItem("numbersCalled");
        if(getNumberCalled){
          return JSON.parse(getNumberCalled);
        }else{
          return [];
        }
    });
    const [generatedTickets, setGeneratedTickets] = useState(() =>{
      const getGeneratedTicket = localStorage.getItem('generatedTickets');
      if(getGeneratedTicket){
        return JSON.parse(getGeneratedTicket);
      }else{
        return [];
      }
    });
    const [numOfTickets, setNumOfTickets] = useState(20);
   
  
    useEffect(() => {
      generateTickets();
    }, [numOfTickets]);

  
    const storeGameData = () => {
      localStorage.setItem('numbersCalled', JSON.stringify(numbersCalled));
      localStorage.setItem('generatedTickets', JSON.stringify(generatedTickets));
    };
  
    useEffect(() => {
      storeGameData();
    }, [numbersCalled, generatedTickets]);
  
    const generateTickets = () => {
      const generated = [];
      for (let i = 0; i < numOfTickets; i++) {
        const ticket = generateRandomTicket();
        generated.push(ticket);
      }
      setGeneratedTickets(generated);
    };
  
    const generateRandomTicket = () => {
      const ticket = [];
      const numbers = Array.from({ length: 90 }, (_, i) => i + 1);
      for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        const number = numbers.splice(randomIndex, 1)[0];
        ticket.push({ number, called: false });
      }
      return ticket;
    };
  
    const callNextNumber = () => {
      const remainingNumbers = Array.from({ length: 90 }, (_, i) => i + 1).filter(
        (number) => !numbersCalled.includes(number)
    
      );
  
      const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
      const nextNumber = remainingNumbers[randomIndex];
  
      setNumbersCalled((prevNumbersCalled) => [...prevNumbersCalled, nextNumber]);

      const updatedTickets = generatedTickets.map((ticket) =>
        ticket.map((numberObj) =>
          numberObj.number === nextNumber ? { ...numberObj, called: true } : numberObj
        )
      );
      setGeneratedTickets(updatedTickets);
    };
  
    const startNewGame = () => {
      setNumbersCalled([]);
      setGeneratedTickets([]);
    };

    
  return (
    <div style={{margin:"5%"}}>
      <h1 style={{textAlign:"center"}}>Tambola Game</h1>

      <div className="tambola-board">
        <h2>Tambola Board</h2>
        <button style={{marginBottom:"20px", marginRight:"10px"}} onClick={callNextNumber}>Call Next Number</button>
        <button onClick={startNewGame}>New Game</button>
        <div className="tambola-board-grid">
          {Array.from({ length: 10 }, (_, i) => i).map((row) => (
            <div key={row} className="tambola-row">
              {Array.from({ length: 9 }, (_, i) => row + 10 * i + 1).map((number) => {
                if (number <= 90) {
                  return (
                    <div
                      key={number}
                      className={`tambola-cell ${numbersCalled.includes(number) ? 'called' : ''}`}
                    >
                      {number}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>Tickets</h2>
        <div>
          <label htmlFor="numOfTickets">Number of Tickets: </label>
          <input
            type="number"
            id="numOfTickets"
            value={numOfTickets}
            onChange={(e) => setNumOfTickets(parseInt(e.target.value))}
          />
        </div>
        <button onClick={generateTickets}>Generate Tickets</button>
        <div className="tickets-container">
          {generatedTickets.map((ticket, index) => (
            <div key={index} className="ticket-card">
              <h3>Ticket {index + 1}</h3>
              <ul>
                {ticket.map((numberObj, numberIndex) => (
                  <li
                    key={numberIndex}
                    className={numberObj.called ? 'called' : ''}
                  >
                    {numberObj.number}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* <button onClick={getpreviousData}>get previous data</button> */}
      </div>
    </div>
  );
};

export default TambolaGame;

