import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/nav";
import Game from "./components/game";
import ScoreTable from "./components/scoreScrn";

const App = () => {
 return (
   <div>
     <Navbar />
     <Routes>
       <Route exact path="/" element={<Game />} />
       <Route path="/score" element={<ScoreTable />} />
     </Routes>
   </div>
 );
};
 export default App;