import React, { useState } from 'react';
import { useSmartContract } from '../SmartContractContext';
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

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSendMessage = () => {
    const newMessages = [...messages];
    newMessages.push({ text: answers[currentQuestionIndex], fromUser: true });
    setMessages(newMessages);
    // API call to backend
    console.log('Sending message:', answers[currentQuestionIndex]);
    
    if (currentQuestionIndex < questions.length - 1) {
      newMessages.push({ text: questions[currentQuestionIndex + 1].text, fromUser: false });
      setMessages(newMessages);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat">
        <div className="conversation">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.fromUser ? 'user' : 'ai'}`}>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className="answer-bubble">
          <input
            type="text"
            value={answers[currentQuestionIndex]}
            onChange={handleAnswerChange}
            placeholder="Type your answer..."
          />
          <button onClick={handleSendMessage}>&#8594;</button>
        </div>
      </div>
    </div>
  );
}

export default AI;
