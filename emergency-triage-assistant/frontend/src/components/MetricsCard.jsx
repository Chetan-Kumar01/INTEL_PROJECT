import { motion } from 'framer-motion';

export default function MetricsCard({ title, value, unit, color = 'blue' }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-xl p-6 bg-gradient-to-br ${colors[color]}`}
    >
      <h3 className="text-white text-sm font-medium opacity-90">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-bold text-white">{value}</p>
        {unit && <span className="ml-2 text-white text-sm opacity-75">{unit}</span>}
      </div>
    </motion.div>
  );
}
