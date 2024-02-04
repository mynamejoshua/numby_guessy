import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from "react-router-dom";

async function fetchRange() {
    let response = await fetch("http://localhost:5000/range");
    if (response.ok) {
        const data = await response.json();
        console.log(data.range)
        return data.range;
    } else {
        return [0, 25];
    }
}

function GameStats({ guesses, timeTaken, range }) {
    return (
        <div>
            <h2>Game Stats</h2>
            <p>Number of Guesses: {guesses}</p>
            <p>Time Taken: {timeTaken} seconds</p>
            <p>Range: {range[0]} - {range[1]}</p>
        </div>
    );
}

function MessageStack({messages}) {
    return (
        <div className="message-stack">
            {messages.map((msg, index) => (
                <div key={index}>{msg}</div>
            ))}
        </div>
    );
}

export default function Game() {
    const [guess, setGuess] = useState('');
    const [messages, setMessages] = useState([""]);
    const [targetNum, setTargetNum] = useState(0);
    const [stats, setStats] = useState({guessRange: [0, 50], guesses: 0, initialTime: 0 , timeTaken: -1, gameOver: false});
    const statsRef = useRef(stats);

    const handleReset = async () => {
        let range = await fetchRange();
        let targ = Math.floor(Math.random() * parseInt(range[1]));

        setStats({guessRange: range, guesses: 0, initialTime: new Date() , timeTaken: -1, gameOver: false});
        setTargetNum(targ);
        setMessages(["".concat("Guess a number between ", range[0], " and ", range[1])]);
        setGuess('');
    };

    // apearantly I need to watch my stats because the could be closed over
    useEffect(() => {
        statsRef.current = stats;
    }, [stats]);

    // https://devtrium.com/posts/async-functions-useeffect
    useEffect(() => { // cant use async here so i make a new function and call it imideately
        const initialize = async () => {await handleReset();};
        initialize().catch(console.error);
    }, []);

    const handleGuessChange = (event) => {
        setGuess(event.target.value);
    };

    const handleSubmit = (event) => { // might need async here
        event.preventDefault();
        if(statsRef.current.gameOver === true) return;

        let updatedStats = {...statsRef.current};
        let message = "";
        console.log("guess:", guess);
        console.log("targ:", targetNum);

        if (guess > targetNum ){
            message = "lower than " + guess;
        } else if (guess < targetNum ) {
            message = "higher than " + guess;
        } else if (parseInt(guess) === targetNum) {
            message = "correct";
            const endTime = new Date();
            updatedStats.timeTaken = (endTime - statsRef.current.initialTime) / 1000;
            updatedStats.gameOver = true;
        } else {
            return;
        }

        // update gamestate
        updatedStats.guesses += 1;
        setStats(updatedStats);
        setMessages([...messages, message]); 
        setGuess(''); 
    };

    return (
    <>
        <div>
            <h1>numby-guessy game</h1>
            {stats.gameOver && 
            <>
                <NavLink to="/score">LeaderBoard</NavLink>
                <GameStats guesses={stats.guesses} timeTaken={stats.timeTaken} range={stats.guessRange}/>
                <button type="button" onClick={handleReset}>Play Again</button>
                <details><summary>message log</summary>
                    <MessageStack messages={messages} />
                </details>
            </>
            }

            {!stats.gameOver &&
            <>
                <form onSubmit={handleSubmit}>
                    <input 
                    type="number" 
                    value={guess} 
                    onChange={handleGuessChange} 
                    placeholder="Enter your guess" 
                    />
                    <button type="submit">Guess</button>
                    <button type="button" onClick={handleReset}>Reset</button>
                </form>
                <MessageStack messages={messages} />
            </>
            }
        </div>
    </>
    );
}
