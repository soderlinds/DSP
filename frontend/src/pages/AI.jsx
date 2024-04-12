import React, { useState, useRef, useEffect } from 'react';
import { useSmartContract } from '../context/SmartContractContext';
import '../styles/_ai.sass';

function AI() {
  const { active, account, tokenBalance, contributeToPerformance } = useSmartContract();
  const [questions] = useState([
    { id: 1, text: 'Hi there!' },
    { id: 2, text: 'So tell me,' },
    { id: 3, text: 'Can you describe a scene for me?' },
    { id: 4, text: 'What sounds do you hear?' },
    { id: 5, text: 'What movements do you see?' },
    { id: 5, text: 'Thank you, are you ready to contribute?' }
  ]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(2);
  const [messages, setMessages] = useState([
    { text: questions[0].text, fromUser: false },
  ]);
  const [typingIndex, setTypingIndex] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: questions[1].text, fromUser: false }
      ]);
    }, 1000);

    const timer2 = setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: questions[2].text, fromUser: false }
      ]);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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

  const handleContribute = () => {
    // Handle sending answers to backend, and add identifier
    console.log("Sending answers to backend:", answers);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat">
        <div className="conversation">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.fromUser ? 'user' : 'ai'} ${index === typingIndex ? 'typing' : ''}`}>
              <p className="message-text">{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="answer-bubble">
          {currentQuestionIndex === questions.length - 1 ? (
            <button onClick={handleContribute} className="contribute-button">Contribute</button>
          ) : (
            <textarea
              value={answers[currentQuestionIndex]}
              onChange={handleAnswerChange}
              onKeyDown={handleKeyPress}
              className="answer-bubble-input"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AI;
