import { motion } from 'framer-motion';

export default function ConfidenceGauge({ score }) {
  const color = score > 75 ? '#10b981' : score > 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="relative w-48 h-24 mx-auto">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          d="M 20 90 A 80 80 0 0 1 180 90"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <motion.path
          d="M 20 90 A 80 80 0 0 1 180 90"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (score / 100) * 251.2}
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: 251.2 - (score / 100) * 251.2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-3xl font-bold" style={{ color }}>{score}</div>
        <div className="text-xs text-slate-500">Confidence Score</div>
      </motion.div>
    </div>
  );
}
