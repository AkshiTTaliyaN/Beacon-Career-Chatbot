import { useState } from 'react';
import ChatWindow from './components/ChatWindow.jsx';
import OptionBar from './components/OptionBar.jsx';
import { BACKEND_ENABLED, BACKEND_URL } from './config.js';
import chatEngine from './engine/chatEngine';

const SESSION_ID = 'default';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, stepsTaken: 0, totalQuestions: 0 });

  const updateProgress = () => {
    if (!BACKEND_ENABLED) {
      const progressState = chatEngine.getProgress(SESSION_ID);
      setProgress(progressState);
    }
  };

  const fetchQuestion = async (choice) => {
    setIsTyping(true);
    try {
      if (BACKEND_ENABLED) {
        const body = { session_id: SESSION_ID };
        if (choice) body.choice = choice;
        const response = await fetch(`${BACKEND_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        const questionText = data.question || data.title || 'Sorry, I could not load the next question.';

        setMessages((prev) => [...prev, { id: Date.now(), role: 'bot', text: questionText }]);
        setCurrentNode({
          id: data.question_id || data.id,
          type: data.type,
          options: data.options || [],
          careers: data.careers || [],
          exams: data.exams || [],
          handoff_message: data.handoff_message || data.message,
          contact_options: data.contact_options || [],
        });
      } else {
        let node = null;
        if (choice) {
          node = await chatEngine.selectOption(SESSION_ID, choice);
        } else {
          node = await chatEngine.start(SESSION_ID);
        }

        const questionText = node?.question || node?.title || 'Sorry, I could not load the next question.';
        setMessages((prev) => [...prev, { id: Date.now(), role: 'bot', text: questionText }]);
        setCurrentNode({
          id: node?.id,
          type: node?.type,
          options: node?.options || [],
          careers: node?.careers || [],
          exams: node?.exams || [],
          handoff_message: node?.message || null,
          contact_options: node?.contact_options || [],
        });
        updateProgress();
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'bot', text: 'Unable to connect to the career assistant. Please try again.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleStart = async () => {
    setStarted(true);
    setMessages([{ id: Date.now(), role: 'bot', text: 'Hello! I am Beacon Career Assistant.' }]);
    chatEngine.reset(SESSION_ID);
    await fetchQuestion();
  };

  const handleReset = () => {
    if (!BACKEND_ENABLED) {
      chatEngine.reset(SESSION_ID);
    }
    setMessages([]);
    setCurrentNode(null);
    setIsTyping(false);
    setStarted(false);
    setProgress({ percent: 0, stepsTaken: 0, totalQuestions: 0 });
  };

  const handleChoice = async (option) => {
    const text = `${option.letter}. ${option.text}`;
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text }]);
    await fetchQuestion(option.letter);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-group">
          <div className="brand-mark">🧭</div>
          <div className="brand-text">
            <div className="brand-title">Beacon</div>
            <div className="brand-subtitle">Career Assistant</div>
          </div>
        </div>
        <button className="reset-button" onClick={handleReset}>
          Start Over
        </button>
      </header>

      <div className="progress-bar-container">
        <div className="progress-label">Progress</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress.percent}%` }} />
        </div>
        <div className="progress-value">{progress.percent}%</div>
      </div>

      <ChatWindow
        messages={messages}
        isTyping={isTyping}
        currentNode={currentNode}
        started={started}
        onStart={handleStart}
        onReset={handleReset}
      />

      {started && currentNode && currentNode.type === 'question' && (
        <OptionBar options={currentNode.options} onSelect={handleChoice} />
      )}
    </div>
  );
}

export default App;
