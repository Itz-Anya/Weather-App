import { Download, CheckCircle } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { motion, AnimatePresence } from "framer-motion";


const PWAInstallButton = () => {
  const { canInstall, install, isInstalled } = usePWAInstall();

  return (
    <AnimatePresence>
      {isInstalled ? (
        <motion.div
          key="installed"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                     bg-green-500/20 border border-green-500/30 text-green-400"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          App Installed
        </motion.div>
      ) : canInstall ? (
        <motion.button
          key="install"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          onClick={install}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                     bg-primary/20 border border-primary/30 backdrop-blur-lg text-primary
                     hover:bg-primary/30 transition-colors cursor-pointer"
          title="Install this app on your device"
        >
          <Download className="w-3.5 h-3.5" />
          Install App
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
};

export default PWAInstallButton;
