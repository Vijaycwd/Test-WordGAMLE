import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { InputGroup, Form, Button, Row, Col } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";

function GroupGameChat({ groupId, gameName, createdAt, userId }) {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const baseParams = {
          group_id: groupId,
          game_name: gameName,
          created_at: new Date(createdAt).toISOString().split("T")[0]
      };
      const params = gameName === 'phrazle'
      ? { ...baseParams, period: periodType }
      : baseParams;
      const response = await axios.get(
          `${baseURL}/groups/get-user-messages.php`,{ params });
      setMessages(response.data);
      } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initial + polling fetch
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(scrollToBottom, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;
    await axios.post(`${baseURL}/groups/send-user-message.php`, {
      group_id: groupId,
      game_name: gameName,
      created_at: createdAt,
      user_id: userId,
      message: text,
    });
    setText("");
    fetchMessages();
  };
  console.log('messages',messages);

  return (
    <Row className="justify-content-center">
      <Col md={12}>
        {/* Chat window */}
        <div className="chat-box border rounded p-3 mb-3" style={{ height: "300px", overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 p-2 rounded ${
                msg.user_id === userId ? "bg-light text-end" : "bg-light text-start"
              }`}
            >
              {msg.avatar ? (
                <img 
                src={`${baseURL}/user/uploads/${msg.avatar}`}
                alt="User Avatar" 
                width="30"
                height="30"
                className="img-fluid rounded-circle mb-2"
                onError={(e) => (e.target.style.display = 'none')}
              />

              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-bar-chart-fill" width="18" height="18" fill="#00BF63" viewBox="0 0 448 512">
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>
                </svg>
              )}
              <small><strong>{msg.username || `User ${msg.user_id}`}</strong></small>
              <div>{msg.message}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <InputGroup>
            <TextareaAutosize
              minRows={1}
              maxRows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="form-control"
            />
            <Button className={`${gameName}-btn`} onClick={sendMessage}>
              <FaPaperPlane />
            </Button>
          </InputGroup>
        </Form>
      </Col>
    </Row>
  );
}

export default GroupGameChat;
