import { motion } from 'framer-motion';

export default function CircularProgress({ percentage, label }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center relative">
      <svg width="180" height="180" className="transform -rotate-90">
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
          fill="none"
        />
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          stroke="#6366f1"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-center"
        >
          <div className="text-4xl font-bold text-white">{percentage}%</div>
          <div className="text-sm text-slate-500 mt-1">{label}</div>
        </motion.div>
      </div>
    </div>
  );
}
