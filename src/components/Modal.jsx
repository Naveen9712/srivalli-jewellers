import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-h-[92vh] sm:max-h-none ${sizes[size]} bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-primary-900 text-white shrink-0">
              <h2 className="text-base sm:text-lg font-semibold pr-2">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
            <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1 min-h-0">{children}</div>
            {footer && (
              <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
