import React, { useState, useRef, useEffect } from 'react';
import { useSmartContract } from '../context/SmartContractContext';
import '../styles/_ai.sass';

function AI() {
  const { active, account, tokenBalance, contributeToPerformance } = useSmartContract();
  const [questions] = useState([
    { id: 1, text: 'Describe a scene' },
    { id: 2, text: 'Describe the sounds' },
    { id: 3, text: 'Describe the movements' }
  ]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState([{ text: questions[0].text, fromUser: false }]);
  const [typingIndex, setTypingIndex] = useState(null);
  const [isTyping, setIsTyping] = useState(false); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSendMessage = () => {
    sendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = () => {
    const newMessages = [...messages];
    newMessages.push({ text: isTyping ? '...' : answers[currentQuestionIndex], fromUser: true });
    setMessages(newMessages);
    setIsTyping(true); 

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => { 
        newMessages.push({ text: questions[currentQuestionIndex + 1].text, fromUser: false });
        setMessages(newMessages);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsTyping(false); 
      }, 1000); 

    }
    setAnswers(Array(questions.length).fill(''));
  };

  return (
    <div className="chat-container">
      <div className="chat">
        <div className="conversation">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.fromUser ? 'user' : 'ai'} ${index === typingIndex ? 'typing' : ''}`}>
              <p>{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="answer-bubble">
          <input
            type="text"
            value={answers[currentQuestionIndex]}
            onChange={handleAnswerChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your answer..."
          />
          <button onClick={handleSendMessage}>&#8594;</button>
        </div>
      </div>
    </div>
  );
}

export default AI;
