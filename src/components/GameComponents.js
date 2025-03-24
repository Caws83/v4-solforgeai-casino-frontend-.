import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Minimal Blackjack component
export default function BlackjackGame() {
  return (
    <div className="text-center text-white mt-20">
      <h1 className="text-4xl font-bold text-purple-300 mb-6 animate-pulse">♠️ Blackjack Coming Soon</h1>
      <p className="text-lg">Work in progress... try your luck in Slots meanwhile!</p>
    </div>
  );
}

// FULL Poker + Roulette components are below
export function PokerGame() {
  const socket = io("https://backend-solforge-ai-casino.onrender.com");
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🧑");
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [hand, setHand] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [pot, setPot] = useState(0);
  const [winner, setWinner] = useState(null);

  const avatarOptions = ["🧑", "🧙", "👽", "🤖", "🐱", "🐸"];

  useEffect(() => {
    socket.on("update-players", (list) => setPlayers(list));
    socket.on("chat-message", (msg) => setChat((prev) => [...prev, msg]));
    socket.on("deal-cards", ({ cards }) => setHand(cards));
    socket.on("community-cards", (cards) => setCommunityCards(cards));
    socket.on("turn-update", (id) => setCurrentTurn(id));
    socket.on("pot-update", (value) => setPot(value));
    socket.on("round-result", ({ winner }) => setWinner(winner));
    return () => {
      socket.off("update-players");
      socket.off("chat-message");
    };
  }, []);

  const joinTable = () => {
    if (!name) return;
    const newPlayer = { id: socket.id, name, avatar, seat: players.length };
    socket.emit("join-table", newPlayer);
    setPlayer(newPlayer);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socket.emit("chat-message", { from: player.name, message: chatInput });
    setChatInput("");
  };

  const isHost = players.length > 0 && players[0].id === player.id;

  const startGame = () => {
    if (isHost) {
      socket.emit("start-game");
    } else {
      alert("Only the host can start the game.");
    }
  };

  const performAction = (action) => {
    socket.emit("player-action", { id: player.id, action });
  };

  if (!player) {
    return (
      <div className="text-center text-white mt-20">
        <h1 className="text-3xl font-bold mb-4">Join the Poker Table</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="px-4 py-2 rounded text-black mb-4"
        />
        <div className="flex justify-center gap-2 mb-4">
          {avatarOptions.map((a) => (
            <button key={a} onClick={() => setAvatar(a)} className={avatar === a ? "ring-2 ring-cyan-400" : ""}>
              <span className="text-2xl">{a}</span>
            </button>
          ))}
        </div>
        <button onClick={joinTable} className="bg-green-500 px-6 py-2 rounded text-white">
          Join Table
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white flex flex-col items-center justify-center p-6">
      <h2 className="text-5xl font-extrabold text-cyan-400 neon-text mb-10 animate-pulse drop-shadow">🃏 Welcome to the SolForgeAI Poker Table</h2>
      <div className="relative w-full max-w-5xl h-[400px] flex items-center justify-center mb-12 bg-[#111] border-4 border-cyan-600 rounded-full shadow-2xl">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center text-yellow-300 text-lg">🪙 Pot: <strong className="animate-bounce">{pot}</strong></div>
        {players.map((p, idx) => {
          const angle = (360 / players.length) * idx;
          const radius = 150;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);
          return (
            <div key={idx} className={`absolute`} style={{ transform: `translate(${x}px, ${y}px)` }}>
              <div className={`bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-center border-2 ${currentTurn === p.id ? 'border-yellow-400 animate-pulse' : 'border-transparent'}`}>
                <div className="text-2xl">{p.avatar}</div>
                <div className="text-sm">{p.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-black p-4 rounded border border-gray-700 max-w-xl mx-auto">
        <h3 className="text-cyan-300 font-bold mb-2">💬 Chat</h3>
        <div className="h-40 overflow-y-scroll mb-2 bg-gray-900 p-2 text-sm">
          {chat.map((c, i) => (
            <div key={i}><strong>{c.from}:</strong> {c.message}</div>
          ))}
        </div>
        <form onSubmit={sendChat} className="flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 text-black px-2 rounded"
            placeholder="Type message..."
          />
          <button type="submit" className="bg-cyan-500 px-3 rounded text-white">Send</button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Actions</h3>
        <div className="space-x-4">
          <button onClick={startGame} className="bg-green-600 px-4 py-2 rounded">Start Game</button>
          <button onClick={() => performAction("call")} className="bg-blue-500 px-4 py-2 rounded">Call</button>
          <button onClick={() => performAction("raise")} className="bg-yellow-500 px-4 py-2 rounded">Raise</button>
          <button onClick={() => performAction("fold")} className="bg-red-500 px-4 py-2 rounded">Fold</button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2 text-cyan-400">🃎 Your Hand</h3>
        <div className="flex justify-center space-x-4 text-3xl transition-all duration-500 ease-out animate-fade-in">
          {hand.map((card, i) => <span key={i} className="transition-transform transform hover:scale-110 duration-300 ease-in-out">{card}</span>)}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2 text-pink-400">🌐 Community Cards</h3>
        <div className="flex justify-center space-x-4 text-2xl transition-all duration-500 ease-in-out animate-fade-in">
          {communityCards.map((card, i) => <span key={i}>{card}</span>)}
        </div>
      </div>

      <div className="mt-4 text-lg">
        <p>🪙 Pot: <strong className="text-yellow-300 animate-bounce">{pot}</strong></p>
        {winner && <p className="text-green-400 font-bold">🏆 Winner: {winner}</p>}
        {currentTurn && <p className="text-yellow-400">🎯 It's {players.find(p => p.id === currentTurn)?.name}'s turn</p>}
      </div>
    </div>
  );
}

export function RouletteGame() {
  return (
    <div className="text-center text-white mt-20">
      <h1 className="text-4xl font-bold text-red-300 mb-6 animate-pulse">🎡 Roulette in Development</h1>
      <p className="text-lg">Spin the wheel soon!</p>
    </div>
  );
}
