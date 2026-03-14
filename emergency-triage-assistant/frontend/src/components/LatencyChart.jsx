import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function LatencyChart({ latency }) {
  const data = [
    { name: 'Compression', ms: latency.compression || 0 },
    { name: 'LLM', ms: latency.llm || 0 },
    { name: 'Verification', ms: latency.verification || 0 },
    { name: 'Confidence', ms: latency.confidence || 0 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Latency Breakdown</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="ms" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
