import { motion } from 'framer-motion';
import MetricsCard from './MetricsCard';

export default function ComparisonView({ naiveData, optimizedData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
    >
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Naive Approach</h2>
        <div className="space-y-4">
          <MetricsCard
            title="Total Latency"
            value={naiveData.latency.total}
            unit="ms"
            color="red"
          />
          <MetricsCard
            title="Tokens Used"
            value={naiveData.tokenStats.originalTokens}
            color="orange"
          />
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Recommendation:</h4>
            <p className="text-gray-600 text-sm">{naiveData.recommendation}</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Optimized Approach</h2>
        <div className="space-y-4">
          <MetricsCard
            title="Total Latency"
            value={optimizedData.latency.total}
            unit="ms"
            color="green"
          />
          <MetricsCard
            title="Tokens Used"
            value={optimizedData.tokenStats.compressedTokens}
            color="blue"
          />
          <MetricsCard
            title="Token Reduction"
            value={optimizedData.tokenStats.reduction}
            unit="%"
            color="purple"
          />
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Recommendation:</h4>
            <p className="text-gray-600 text-sm">{optimizedData.recommendation}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">Confidence: {optimizedData.confidence.level}</span>
              <span className="text-xs text-gray-500">Score: {optimizedData.confidence.score}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
