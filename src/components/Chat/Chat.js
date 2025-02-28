import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button, Spinner, TextField } from "@radix-ui/themes";

// Initialisation de l'IA Google
const genAI = new GoogleGenerativeAI("TA_CLE_API_ICI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Charger l'historique des chats depuis localStorage
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chats")) || [];
    setChats(savedChats);
    if (savedChats.length > 0) {
      setMessages(savedChats[savedChats.length - 1].messages);
    }
  }, []);

  // Fonction pour envoyer un message à l'IA
  async function run(message) {
    setIsLoading(true);
    try {
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();
      setMessages((prevMessages) => [...prevMessages, { text, sender: "ai" }]);
    } catch (error) {
      console.error("Erreur lors de la réponse de l'IA:", error);
    }
    setIsLoading(false);
  }

  // Envoi d'un message
  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = { text: inputValue, sender: "human" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      run(inputValue);
      setInputValue("");
    }
  };

  // Création d'un nouveau chat
  const handleNewChat = () => {
    if (messages.length > 0) {
      const newChat = { id: Date.now(), messages: [...messages], name: `Chat ${chats.length + 1}` };
      const updatedChats = [...chats, newChat];
      setChats(updatedChats);
      localStorage.setItem("chats", JSON.stringify(updatedChats));
    }
    setMessages([]); // Réinitialiser les messages pour un nouveau chat
  };

  return (
    <div style={styles.container}>
      {/* En-tête avec bouton "Nouveau Chat" */}
      <div style={styles.header}>
        <Button onClick={handleNewChat} style={styles.newChatButton}>
          Nouveau Chat
        </Button>
      </div>

      {/* Fenêtre des messages */}
      <div style={styles.chatWindow}>
        {messages.map((message, index) => (
          <div key={index} style={{ ...styles.message, ...styles[message.sender] }}>
            {message.text}
          </div>
        ))}
        {isLoading && <Spinner />}
      </div>

      {/* Champ d'entrée de message */}
      <div style={styles.inputContainer}>
        <TextField.Root
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Votre message..."
          style={styles.inputField}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} style={styles.sendButton}>
          Envoyer
        </Button>
      </div>

      {/* Historique des Chats */}
      <div style={styles.historyContainer}>
        <h3>Historique des Chats</h3>
        {chats.map((chat) => (
          <div key={chat.id} style={styles.historyItem} onClick={() => setMessages(chat.messages)}>
            {chat.name}
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles en ligne
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "80vh",
    width: "400px",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  newChatButton: {
    backgroundColor: "#28a745",
    color: "white",
  },
  chatWindow: {
    flexGrow: 1,
    overflowY: "auto",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  message: {
    margin: "10px 0",
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%",
    wordWrap: "break-word",
  },
  human: {
    backgroundColor: "#007bff",
    color: "white",
    marginLeft: "auto",
  },
  ai: {
    backgroundColor: "#e1e1e1",
    color: "black",
    marginRight: "auto",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  inputField: {
    flexGrow: 1,
  },
  sendButton: {
    backgroundColor: "#007bff",
    color: "white",
  },
  historyContainer: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "8px",
  },
  historyItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
  },
};

export default Chat;
