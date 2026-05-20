import { motion } from 'framer-motion'
import { FiLoader } from 'react-icons/fi'

export default function Loader({ fullScreen = false, text = 'Loading...' }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <FiLoader className="text-3xl text-gold-500" />
      </motion.div>
      <p className="text-sm text-slate-500 font-medium">{text}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return <div className="py-12">{content}</div>
}
