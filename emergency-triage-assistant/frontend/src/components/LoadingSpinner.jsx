import { motion } from 'framer-motion';

export default function LoadingSpinner({ message = 'Processing...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="dash-card-flat flex flex-col items-center gap-4 px-10 py-8"
        style={{ background: '#1c1f2e', border: '1px solid rgba(99, 102, 241, 0.2)' }}
      >
        <div className="relative w-12 h-12">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-indigo-500/20"
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <p className="text-sm font-medium text-slate-300">{message}</p>
      </motion.div>
    </motion.div>
  );
}
