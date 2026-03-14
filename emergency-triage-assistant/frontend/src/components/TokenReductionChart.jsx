import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

export default function TokenReductionChart({ tokenStats }) {
  const data = [
    { name: 'Original', value: tokenStats.originalTokens },
    { name: 'Saved', value: tokenStats.originalTokens - tokenStats.compressedTokens }
  ];

  const COLORS = ['#ef4444', '#10b981'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Token Reduction</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
