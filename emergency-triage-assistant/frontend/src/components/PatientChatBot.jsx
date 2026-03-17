import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientChatBot({ patientId, patientFileName }) {
  const [patientName, setPatientName] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Welcome! I've indexed the medical document for ${patientFileName}. Ask me anything about this patient's medical history, symptoms, or recommendations.`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('deep');
  const [sources, setSources] = useState(null);
  const [caseHistory, setCaseHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showNameInput, setShowNameInput] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadCaseHistory();
  }, []);

  const loadCaseHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/case_history');
      if (response.ok) {
        const data = await response.json();
        setCaseHistory(data.cases || []);
      }
    } catch (err) {
      console.error('Failed to load case history:', err);
    }
  };

  const saveCaseHistory = async () => {
    if (!patientName.trim()) {
      alert('Please enter a patient name to save this case');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/case_history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: patientName,
          patient_id: patientId,
          document_name: patientFileName,
          messages: messages,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Case saved successfully!');
        loadCaseHistory();
      }
    } catch (err) {
      alert('Failed to save case: ' + err.message);
    }
  };

  const loadCase = (caseData) => {
    setPatientName(caseData.patient_name);
    setMessages(caseData.messages);
    setShowHistory(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    setSources(null);

    try {
      const response = await fetch('http://localhost:8000/chat_patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          question: inputValue,
          mode: mode
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.answer,
          timestamp: new Date(),
          latency: {
            retrieval: data.retrieval_latency_ms,
            llm: data.llm_latency_ms
          }
        };
        setMessages(prev => [...prev, botMessage]);
        setSources(data.sources);
      } else {
        const error = await response.json();
        const errorMessage = {
          id: Date.now() + 1,
          type: 'error',
          content: `Error: ${error.detail || 'Failed to process question'}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Connection error: ${err.message}. Make sure FastAPI backend is running.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Welcome! I've indexed the medical document for ${patientFileName}. Ask me anything about this patient's medical history, symptoms, or recommendations.`,
        timestamp: new Date()
      }
    ]);
    setSources(null);
  };

  return (
    <motion.div
      className="dash-card flex flex-col h-full mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>💬</span> Medical Analysis Chat
          </h3>
          <p className="text-xs text-slate-500 mt-1">Document: {patientFileName}</p>
          {patientName && <p className="text-xs text-indigo-400 mt-1">Patient: {patientName}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded transition"
            title="View saved cases"
          >
            📋 History ({caseHistory.length})
          </button>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="text-xs bg-slate-700 text-slate-200 px-3 py-1 rounded border border-slate-600 hover:border-indigo-500"
          >
            <option value="deep">Deep Analysis</option>
            <option value="emergency">Quick Answer</option>
          </select>
          <button
            onClick={handleClearChat}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Patient Name Input */}
      {showNameInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-indigo-900 bg-opacity-30 rounded-lg p-3 mb-3 border border-indigo-700"
        >
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name (required to save case)"
              className="flex-1 bg-slate-700 text-white placeholder-slate-500 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => setShowNameInput(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm transition"
            >
              ✓
            </button>
          </div>
        </motion.div>
      )}

      {/* Case History Panel */}
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-slate-800 rounded-lg p-3 mb-3 max-h-40 overflow-y-auto border border-slate-700"
        >
          <p className="text-xs font-semibold text-slate-400 mb-2">📋 Saved Cases:</p>
          {caseHistory.length === 0 ? (
            <p className="text-xs text-slate-500">No saved cases yet</p>
          ) : (
            <div className="space-y-2">
              {caseHistory.map((caseItem, idx) => (
                <div
                  key={idx}
                  className="bg-slate-700 p-2 rounded cursor-pointer hover:bg-slate-600 transition"
                  onClick={() => loadCase(caseItem)}
                >
                  <p className="text-xs font-medium text-indigo-400">{caseItem.patient_name}</p>
                  <p className="text-xs text-slate-400">{caseItem.document_name}</p>
                  <p className="text-xs text-slate-500">{new Date(caseItem.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : message.type === 'error'
                    ? 'bg-rose-900 text-rose-200'
                    : 'bg-slate-800 text-slate-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.latency && (
                  <p className="text-xs opacity-70 mt-1">
                    ⚡ {message.latency.retrieval.toFixed(0)}ms retrieval • {message.latency.llm.toFixed(0)}ms LLM
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Sources Display */}
      {sources && sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-800 rounded-lg p-3 mb-3 max-h-24 overflow-y-auto border border-slate-700"
        >
          <p className="text-xs font-semibold text-slate-400 mb-2">📌 Source Chunks:</p>
          <div className="space-y-1">
            {sources.map((source, idx) => (
              <div key={idx} className="text-xs text-slate-400">
                <span className="text-blue-400">Chunk {source.chunk_id}</span> (Score: {(source.similarity_score * 100).toFixed(0)}%)
                <p className="text-slate-500 mt-0.5">{source.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about medical history, symptoms, recommendations..."
          disabled={loading}
          className="flex-1 bg-slate-700 text-white placeholder-slate-500 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳' : '📤'}
        </button>
      </form>

      {/* Save Case Button */}
      {patientName && (
        <button
          onClick={saveCaseHistory}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          💾 Save Case as "{patientName}"
        </button>
      )}
    </motion.div>
  );
}
