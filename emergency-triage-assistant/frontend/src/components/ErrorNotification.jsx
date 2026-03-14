import { motion, AnimatePresence } from 'framer-motion';

export default function ErrorNotification({ error, onClose }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-6 left-1/2 z-[100] max-w-md w-full"
        >
          <div className="mx-4 px-5 py-4 rounded-xl border border-rose-500/20 bg-rose-500/10 backdrop-blur-sm flex items-start gap-3">
            <span className="text-rose-400 text-lg mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-rose-300">{error}</p>
            </div>
            <button
              onClick={onClose}
              className="text-rose-400/60 hover:text-rose-300 transition text-lg leading-none"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
