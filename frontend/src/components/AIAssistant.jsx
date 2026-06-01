import {
  Bot,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

function AIAssistant() {

  return (

    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="fixed bottom-8 right-8 z-50"
    >

      <button
        className="group relative w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30 hover:scale-110 transition-all duration-300"
      >

        <Bot
          size={34}
          className="text-white"
        />

        {/* Pulse */}

        <span className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />

      </button>

      {/* Label */}

      <div className="absolute right-24 bottom-4 glass rounded-2xl px-5 py-3 whitespace-nowrap hidden xl:block">

        <div className="flex items-center gap-2">

          <Sparkles
            size={16}
            className="text-cyan-400"
          />

          <span className="font-medium">
            AI Legal Assistant
          </span>

        </div>

      </div>

    </motion.div>
  );
}

export default AIAssistant;