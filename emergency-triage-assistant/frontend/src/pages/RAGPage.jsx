import { useState } from 'react';
import { motion } from 'framer-motion';
import PDFScanner from '../components/PDFScanner';
import RAGDashboard from '../components/RAGDashboard';

export default function RAGPage() {
  const [activeTab, setActiveTab] = useState('scanner');

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-lg">
              📚
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">RAG System</h1>
              <p className="text-xs text-slate-500">Document Analysis v1.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`nav-item w-full text-left ${activeTab === 'scanner' ? 'active' : ''}`}
          >
            <span>📄</span>
            <span>PDF Scanner</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`nav-item w-full text-left ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <span>🔍</span>
            <span>Query Assistant</span>
          </button>
        </nav>

        <div className="mt-auto space-y-3">
          <div className="dash-card-flat" style={{ padding: '14px' }}>
            <p className="text-xs text-slate-500">
              💡 Upload PDFs to build a knowledge base. Query using natural language.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Medical Document Analysis</h2>
            <p className="text-sm text-slate-500">Upload medical PDFs, index them, and ask intelligent questions</p>
          </div>

          {activeTab === 'scanner' ? (
            <div className="space-y-6">
              <PDFScanner onExtractedText={(filename) => console.log(filename)} />
              
              {/* Quick Start Guide */}
              <motion.div
                className="dash-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">📖 Quick Start Guide</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-500 text-white font-bold">
                        1
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Upload Your PDF</h4>
                      <p className="text-sm text-slate-400 mt-1">Click the upload area to select a medical PDF file (max 10MB)</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-600 text-white font-bold">
                        2
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Extract & Index</h4>
                      <p className="text-sm text-slate-400 mt-1">Click "Extract Text" or "Analyze & Index" to process the document</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-700 text-white font-bold">
                        3
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Query Your Documents</h4>
                      <p className="text-sm text-slate-400 mt-1">Go to "Query Assistant" tab to ask questions about the uploaded documents</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                className="dash-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">✨ RAG System Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm font-semibold text-white mb-2">🔍 Smart Retrieval</p>
                    <p className="text-xs text-slate-400">Find relevant sections from multiple PDFs instantly</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm font-semibold text-white mb-2">🧠 Semantic Search</p>
                    <p className="text-xs text-slate-400">Understand meaning, not just keywords</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm font-semibold text-white mb-2">⚡ Fast Processing</p>
                    <p className="text-xs text-slate-400">&lt;500ms latency with GROQ LLM</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm font-semibold text-white mb-2">📊 Accurate Answers</p>
                    <p className="text-xs text-slate-400">Get cited references from source documents</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <RAGDashboard />
          )}
        </motion.div>
      </main>
    </div>
  );
}
