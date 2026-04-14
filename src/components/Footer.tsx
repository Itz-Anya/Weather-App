import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="w-full py-8 mt-12 text-center relative z-10"
    >
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground/60 font-medium tracking-wide">
          Credits:{" "}
          <a
            href="https://t.me/Sylveonlab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/70 hover:text-primary transition-colors hover:underline underline-offset-4"
          >
            Anya
          </a>
        </p>
        <div className="h-1 w-8 rounded-full bg-primary/20" />
      </div>
    </motion.footer>
  );
};

export default Footer;
