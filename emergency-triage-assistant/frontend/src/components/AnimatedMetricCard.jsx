import { motion } from 'framer-motion';

export default function AnimatedMetricCard({ title, value, unit, icon, color = 'blue', delay = 0 }) {
  const cardClasses = {
    blue: 'metric-card-blue',
    green: 'metric-card-emerald',
    purple: 'metric-card-purple',
    red: 'metric-card-rose',
    orange: 'metric-card-rose',
    teal: 'metric-card-teal'
  };

  const icons = {
    clock: '⏱️',
    token: '🔢',
    check: '✅',
    chart: '📊',
    heart: '❤️',
    brain: '🧠'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.03, y: -3 }}
      className={`${cardClasses[color]} rounded-2xl p-5 relative overflow-hidden`}
    >
      <motion.div
        className="absolute -right-3 -top-3 text-5xl opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {icons[icon] || '📊'}
      </motion.div>

      <div className="relative z-10">
        <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">{title}</h3>
        <div className="flex items-baseline">
          <motion.p
            className="text-3xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: "spring" }}
          >
            {value}
          </motion.p>
          {unit && <span className="ml-2 text-slate-400 text-sm">{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
}
