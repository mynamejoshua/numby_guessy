import React, { useState } from 'react';



const fetchTargetNumber = async () => {
    try {
        const response = await fetch(`http://localhost:5000/targetNum`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received number:", data.number);
        return data.number;
    } catch (error) {
        console.error("Failed to fetch target number:", error);
    }
};



export default function Game() {

const [guessRange, setGuessRange] = useState([0,50]);   
const [guess, setGuess] = useState('');
const [messages, setMessages] = useState(["".concat("Guess a number between ", guessRange[0], " and ", guessRange[1])]);
const [targetNum, setTargetNum] = useState(0);

const handleGuessChange = (event) => {
    setGuess(event.target.value);
};

const handleSubmit = (event) => { // might need async here
    event.preventDefault();

    // const response = await sendGuessToBackend(guess);
    let response = {message: ""};
    console.log("guess:", guess);
    console.log("targ:", targetNum);

    if (guess > targetNum ){
        response.message = "lower than " + guess;
    } else if (guess < targetNum ) {
        response.message = "higher than " + guess;
    } else if (parseInt(guess) === targetNum) {
        response.message = "correct";
        // prolly some use effecting to make a you win screen or somthing
    } else {
        return;
    }
    setMessages([...messages, response.message]); 
    setGuess(''); 
};

const handleReset = () => {
    setGuess('');
    setMessages(["".concat("Guess a number between ", guessRange[0], " and ", guessRange[1])]);
    let targ = fetchTargetNumber();
    setTargetNum(targ);
};

return (
<>
    <div>
    <h1>numby-guessy game</h1>
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
    </div>
    <div className="message-stack">
        {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
        ))}
    </div>
    
</>
);
}


// export default function Game() {
//     let topnumber = 10;
//     let bottomnumber = 0;
//     return (
//         <div>
//             Game goes here
//             <h2>The Numby-guessy Game</h2>
//             <p>A random number between {topnumber} and {bottomnumber}. Enter a guess to be told if it is higher or lower. Guess correctly to win! </p>
//             <br></br>
            
//         </div>
//     )
// }
