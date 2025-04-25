import { motion } from "framer-motion";

export const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-6"
      >
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-800/20 dark:border-cyan-600/20 rounded-full" />
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-cyan-800 dark:border-cyan-600 border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="flex items-center space-x-2">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-cyan-800 dark:text-cyan-600 font-medium"
          >
            Loading
          </motion.span>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="text-cyan-800 dark:text-cyan-600 font-medium"
          >
            .
          </motion.div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="text-cyan-800 dark:text-cyan-600 font-medium"
          >
            .
          </motion.div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            className="text-cyan-800 dark:text-cyan-600 font-medium"
          >
            .
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
