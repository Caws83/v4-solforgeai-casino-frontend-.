import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PokerGame, RouletteGame } from "./components/GameComponents";
import BlackjackGame from "./components/GameComponents";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PokerGame />} />
        <Route path="/roulette" element={<RouletteGame />} />
        <Route path="/blackjack" element={<BlackjackGame />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
