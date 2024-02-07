import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";

async function FetchRange(name) {
    let response = await fetch("http://localhost:5000/range", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: name}),
        })
        .catch(error => {
            window.alert(error);
        });

    const data = await response.json();
    console.log(data.range)
    return data.range;
}

async function FetchGuessStatus(name, guess){
    let response = await fetch("http://localhost:5000/guess", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: name, guess: guess}),
        })
        .catch(error => {
            window.alert(error);
            return;
        });
    
    const data = await response.json();
    return {message: data.message, winner: data.winner};
}

function GameStats({ name, guesses, timeTaken, range }) {
    return (
        <div>
            <h2>Game Stats</h2>
            <p>Name: {name}</p>
            <p>Number of Guesses: {guesses}</p>
            <p>Time Taken: {timeTaken} seconds</p>
            <p>Range: {range[0]} - {range[1]}</p>
        </div>
    );
}

function MessageStack({ messages }) {
    return (
        <div className="message-stack">
            {messages.map((msg, index) => (
                <div key={index}>{msg}</div>
            ))}
        </div>
    );
}

export default function Game() {
    const navigate = useNavigate();
    // w3schools said use location
    const userName = useLocation().state?.userName || null;
    // const userName = "joe";

    // set up state
    const [guess, setGuess] = useState('');
    const [messages, setMessages] = useState([""]);
    const [gameOver, setGameOver] = useState(false);
    const [stats, setStats] = useState({ guessRange: [0, 50], guesses: 0, initialTime: 0, timeTaken: -1});
    
    const handleReset = async () => {
        let range = await FetchRange(userName);
        setStats({ guessRange: range, guesses: 0, initialTime: null, timeTaken: -1});
        setMessages(["".concat("Guess a number between ", range[0], " and ", range[1])]);
        setGuess('');
        setGameOver(false);
    };

    // https://devtrium.com/posts/async-functions-useeffect
    useEffect(() => { // cant use async here so i make a new function and call it imideately
        if (!userName) { navigate("/"); } // make sure that a user name has been entered
        handleReset().catch(console.error);
    }, []);

    const handleGuessChange = (event) => {
        setGuess(event.target.value);
    };

    const handleSubmit = async (event) => { // might need async here
        event.preventDefault(); // dont triger rerender

        let status = await FetchGuessStatus(userName, guess);
        if (status.winner === true) {
            alert("game over?");
            setGameOver(true);
        } else {

        }
        // update gamestate
        setMessages([...messages, status.message]);
        setGuess('');
    };

    const renderGameOver = () => (
        <>
            <NavLink to="/score">LeaderBoard</NavLink>
            <GameStats name={userName} guesses={stats.guesses} timeTaken={stats.timeTaken} range={stats.guessRange} />
            <details><summary>message log</summary>
                <MessageStack messages={messages} />
            </details>
            <button type="button" onClick={handleReset}>Play Again</button>
        </>
    );

    const renderGamePlay = () => (
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
    );

    return (
        <>
            <h2>Numby-Guessy Game</h2>
            {gameOver ? renderGameOver() : renderGamePlay()}
        </>
    );
}
