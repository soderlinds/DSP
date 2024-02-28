import React, { useState } from 'react';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_ai.sass';

function AI() {
  const { active, account, tokenBalance, contributeToPerformance } = useSmartContract();
  const [questions] = useState([
    { id: 1, text: 'Beskriv en scen' },
    { id: 2, text: 'Beskriv ljudet' },
    { id: 3, text: 'Beskriv rörelserna' }
  ]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState([{ text: questions[0].text, fromUser: false }]);

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newMessages = [...messages];
      newMessages.push({ text: answers[currentQuestionIndex], fromUser: true });
      newMessages.push({ text: questions[currentQuestionIndex + 1].text, fromUser: false });
      setMessages(newMessages);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const saveResponses = () => {
    const newMessages = [...messages];
    newMessages.push({ text: answers[currentQuestionIndex], fromUser: true });
    setMessages(newMessages);
    // API call to backend
    console.log('Saving responses:', answers);
  };

  return (
    <div className="chat-container">
      <div className="chat">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.fromUser ? 'user' : 'ai'}`}>
            <p>{message.text}</p>
          </div>
        ))}
        <div className="answer-bubble">
          <input
            type="text"
            value={answers[currentQuestionIndex]}
            onChange={handleAnswerChange}
            placeholder="Type your answer..."
          />
        </div>
      </div>
      <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
        Next
      </button>
      {currentQuestionIndex === questions.length - 1 && (
        <button onClick={saveResponses}>Finish</button>
      )}
    </div>
  );
}

export default AI;