import { useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function RAGDashboard() {
  const [patientId, setPatientId] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('emergency');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleUpload = async () => {
    if (!pdfFile || !patientId) {
      setUploadStatus('❌ Please provide patient ID and PDF');
      return;
    }

    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('patient_id', patientId);

    setLoading(true);
    setUploadStatus('⏳ Uploading...');

    try {
      const res = await fetch(`${API_BASE}/upload-pdf`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setUploadStatus(`✅ Uploaded: ${data.chunks_created} chunks indexed`);
      } else {
        setUploadStatus(`❌ Upload failed: ${data.detail}`);
      }
    } catch (err) {
      setUploadStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!patientId || !query) {
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId, query, mode }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setResponse(data);
      } else {
        setResponse({ error: data.detail || 'Query failed' });
      }
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const isEmergencyFast = response?.latency?.total_ms < 500;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-600">
          <h1 className="text-3xl font-bold text-slate-800">🏥 Emergency RAG Assistant</h1>
          <p className="text-slate-600 mt-1">AI-Powered Medical Document Analysis</p>
        </div>

        {/* PDF Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">📄 Patient Document Upload</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Patient ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="e.g., patient_001"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">PDF File</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-400 transition"
            >
              {loading ? '⏳ Processing...' : '📤 Upload & Index'}
            </button>

            {uploadStatus && (
              <div className={`p-3 rounded-lg ${uploadStatus.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {uploadStatus}
              </div>
            )}
          </div>
        </div>

        {/* Query Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">💬 Query Patient Records</h2>

          {/* Mode Toggle */}
          <div className="flex items-center gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-700">Analysis Mode:</span>
            <button
              onClick={() => setMode('emergency')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                mode === 'emergency'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-300'
              }`}
            >
              🔴 Emergency
            </button>
            <button
              onClick={() => setMode('deep')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                mode === 'deep'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-300'
              }`}
            >
              🔵 Deep Analysis
            </button>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about patient history, vitals, medications, diagnoses..."
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          />

          <button
            onClick={handleQuery}
            disabled={loading || !patientId || !query}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-slate-400 transition"
          >
            {loading ? '⏳ Analyzing...' : '🔍 Query Records'}
          </button>
        </div>

        {/* Response Section */}
        {response && !response.error && (
          <div className="space-y-6">
            {/* AI Response */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">🤖 AI Response</h3>
              <div className="prose max-w-none text-slate-700 leading-relaxed">
                {response.answer}
              </div>
            </div>

            {/* Latency Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">⚡ Performance Metrics</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{response.latency.retrieval_ms}ms</div>
                  <div className="text-sm text-slate-600">Retrieval</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{response.latency.llm_ms}ms</div>
                  <div className="text-sm text-slate-600">LLM Generation</div>
                </div>
                <div className={`p-4 rounded-lg text-center ${isEmergencyFast ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <div className={`text-2xl font-bold ${isEmergencyFast ? 'text-green-600' : 'text-yellow-600'}`}>
                    {response.latency.total_ms}ms
                  </div>
                  <div className="text-sm text-slate-600">Total Pipeline</div>
                </div>
              </div>

              {mode === 'emergency' && (
                <div className={`p-3 rounded-lg text-center font-semibold ${
                  isEmergencyFast 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isEmergencyFast ? '✅ Emergency Target Met (<500ms)' : '⚠️ Exceeded 500ms Target'}
                </div>
              )}
            </div>

            {/* Retrieved Segments */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                📚 Retrieved Segments ({response.cited_segments.length})
              </h3>
              
              <div className="space-y-3">
                {response.cited_segments.map((segment) => (
                  <div key={segment.segment_id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-blue-600">Segment {segment.segment_id}</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {(segment.similarity * 100).toFixed(1)}% match
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm">{segment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {response?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
            ❌ Error: {response.error}
          </div>
        )}
      </div>
    </div>
  );
}
