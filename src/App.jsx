import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";

const host = "https://chat-back-ai1n.onrender.com/";
// const host = "http://localhost:3000";

const socket = io(host);

const MOCK = [
  { id: 1, text: "hola" },
  { id: 2, text: "como estas?" },
];

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("connect", setIsConnected(true));
    socket.on("message", (data) => {
      console.log("data", data);
      // if (data.user !== socket.id) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: data.message },
      ]);
      // }
    });

    return () => {
      socket.off("connect");
      socket.off("message");
    };
  }, []);

  const handleAddMessage = () => {
    // setMessages((prev) => [...prev, { id: prev.length + 1, text: message }]);
    socket.emit("message", {
      user: socket.id,
      message,
    });
    setMessage("");
  };

  return (
    <section className="main-container">
      <input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="message-input"
        type="text"
      />
      <button onClick={handleAddMessage}>Enviar mensaje</button>
      <div
        className={`status-box ${isConnected ? "connected" : "not-connected"}`}
      >
        <ul>
          {messages.map((message) => (
            <li key={message.id}>{message.text}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default App;
