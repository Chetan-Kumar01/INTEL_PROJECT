import { useState } from 'react';
import { motion } from 'framer-motion';
import { setApiKeys as setApiKeysAPI, ApiError } from '../utils/apiClient';

export default function Settings({ onKeysSet, sessionId }) {
  const [scaleDownKey, setScaleDownKey] = useState('');
  const [llmKey, setLlmKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const data = await setApiKeysAPI(scaleDownKey, llmKey);
      onKeysSet(data.data.sessionId);
      setScaleDownKey('');
      setLlmKey('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to configure API keys. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-6 mb-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🔐 API Key Configuration</h2>
      
      {sessionId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-green-800 text-sm">✓ API keys configured (session active)</p>
        </div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4"
        >
          <p className="text-green-800 text-sm">✓ Keys configured successfully!</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ScaleDown API Key (OpenAI)
          </label>
          <input
            type="password"
            value={scaleDownKey}
            onChange={(e) => setScaleDownKey(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="sk-..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LLM API Key (OpenAI)
          </label>
          <input
            type="password"
            value={llmKey}
            onChange={(e) => setLlmKey(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="sk-..."
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Configuring...' : 'Set API Keys'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>🔒 Keys are stored in server memory only (not persisted)</p>
        <p>⏱️ Session expires after 1 hour of inactivity</p>
      </div>
    </motion.div>
  );
}
