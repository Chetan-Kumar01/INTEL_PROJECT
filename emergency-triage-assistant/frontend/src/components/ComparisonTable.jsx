import { motion } from 'framer-motion';

export default function ComparisonTable({ naive, optimized }) {
  const savings = {
    tokens: ((naive.tokens - optimized.tokens) / naive.tokens * 100).toFixed(1),
    latency: naive.latency_ms - optimized.latency_ms,
    cost: ((naive.estimated_cost - optimized.estimated_cost) / naive.estimated_cost * 100).toFixed(1)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dash-card"
    >
      <h2 className="text-xl font-bold text-white mb-6">📊 A/B Comparison</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 font-semibold text-slate-400 text-sm">Metric</th>
              <th className="text-center py-3 px-4 font-semibold text-rose-400 text-sm">Naive</th>
              <th className="text-center py-3 px-4 font-semibold text-emerald-400 text-sm">Optimized</th>
              <th className="text-center py-3 px-4 font-semibold text-indigo-400 text-sm">Savings</th>
            </tr>
          </thead>
          <tbody>
            <motion.tr
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="border-b border-white/5"
            >
              <td className="py-4 px-4 font-medium text-slate-300">Tokens</td>
              <td className="py-4 px-4 text-center text-rose-400 font-bold">{naive.tokens}</td>
              <td className="py-4 px-4 text-center text-emerald-400 font-bold">{optimized.tokens}</td>
              <td className="py-4 px-4 text-center text-indigo-400 font-bold">↓ {savings.tokens}%</td>
            </motion.tr>

            <motion.tr
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="border-b border-white/5"
            >
              <td className="py-4 px-4 font-medium text-slate-300">Latency</td>
              <td className="py-4 px-4 text-center text-rose-400 font-bold">{naive.latency_ms}ms</td>
              <td className="py-4 px-4 text-center text-emerald-400 font-bold">{optimized.latency_ms}ms</td>
              <td className="py-4 px-4 text-center text-indigo-400 font-bold">
                {savings.latency > 0 ? `↓ ${savings.latency}ms` : `↑ ${Math.abs(savings.latency)}ms`}
              </td>
            </motion.tr>

            <motion.tr
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="border-b border-white/5"
            >
              <td className="py-4 px-4 font-medium text-slate-300">Estimated Cost</td>
              <td className="py-4 px-4 text-center text-rose-400 font-bold">${naive.estimated_cost}</td>
              <td className="py-4 px-4 text-center text-emerald-400 font-bold">${optimized.estimated_cost}</td>
              <td className="py-4 px-4 text-center text-indigo-400 font-bold">↓ {savings.cost}%</td>
            </motion.tr>

            <motion.tr
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <td className="py-4 px-4 font-medium text-slate-300">Confidence Score</td>
              <td className="py-4 px-4 text-center text-rose-400 font-bold">{naive.confidence.score}</td>
              <td className="py-4 px-4 text-center text-emerald-400 font-bold">{optimized.confidence.score}</td>
              <td className="py-4 px-4 text-center text-slate-400 font-bold">
                {(optimized.confidence.score - naive.confidence.score).toFixed(2)}
              </td>
            </motion.tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="metric-card-emerald rounded-xl p-4"
        >
          <div className="text-xs text-slate-400 uppercase tracking-wider">Token Reduction</div>
          <div className="text-3xl font-bold text-emerald-400 mt-1">{savings.tokens}%</div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 }}
          className="metric-card-blue rounded-xl p-4"
        >
          <div className="text-xs text-slate-400 uppercase tracking-wider">Cost Savings</div>
          <div className="text-3xl font-bold text-blue-400 mt-1">{savings.cost}%</div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7 }}
          className="metric-card-purple rounded-xl p-4"
        >
          <div className="text-xs text-slate-400 uppercase tracking-wider">Verification</div>
          <div className="text-xl font-bold text-purple-400 mt-1">{optimized.verification.status}</div>
        </motion.div>
      </div>
    </motion.div>
  );
}
