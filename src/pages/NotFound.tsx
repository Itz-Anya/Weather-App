import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const LINES: string[] = [
  "> SYSTEM BOOT... OK",
  "> KERNEL LOAD... OK",
  "> ROUTING TABLE... CORRUPTED",
  "> ATTEMPTING RECOVERY...",
  "> ERROR 0x404: PAGE_NOT_FOUND",
  "> PATH: '{path}' DOES NOT EXIST",
  "> SUGGEST: RETURN TO KNOWN SECTOR",
];

const getLineClass = (line: string): string => {
  if (line.includes("ERROR")) return "term-error";
  if (line.includes("CORRUPTED")) return "term-warn";
  return "term-ok";
};

const NotFound = () => {
  const location = useLocation();
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  useEffect(() => {
    const filled = LINES.map((l) => l.replace("{path}", location.pathname));
    let i = 0;

    const interval = setInterval(() => {
      if (i < filled.length) {
        setVisibleLines((prev) => [...prev, filled[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 280); // Slightly faster and smoother

    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <>
      <style>{CSS}</style>
      <div className="nf-root">
        <div className="nf-grid" />
        <div className="nf-scanline" />

        {/* Corner decorations */}
        <div className="nf-corner nf-corner-tl" />
        <div className="nf-corner nf-corner-tr" />
        <div className="nf-corner nf-corner-bl" />
        <div className="nf-corner nf-corner-br" />

        <div className="nf-badge">
          <span className="nf-badge-dot" />
          SYS.ERR // SECTOR UNREACHABLE
        </div>

        <div className="nf-glitch-wrap">
          <div className="nf-glitch-base">404</div>
          <div className="nf-glitch-base nf-glitch-l1">404</div>
          <div className="nf-glitch-base nf-glitch-l2">404</div>
        </div>

        <p className="nf-subtitle">PAGE_NOT_FOUND</p>

        <div className="nf-terminal">
          {visibleLines.map((line, i) => (
            <div key={i} className={`nf-term-line ${getLineClass(line)}`}>
              {line}
            </div>
          ))}

          {/* Always show cursor - either typing or blinking at the end */}
          <div className={`nf-term-line term-ok ${isTypingComplete ? "nf-cursor-final" : ""}`}>
            <span className="nf-cursor">█</span>
          </div>
        </div>

        <a
          href="/"
          className={`nf-btn${btnHovered ? " nf-btn-hovered" : ""}`}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
        >
          <span className="nf-btn-arrow">◀</span> RETURN TO BASE
        </a>

        <div className="nf-coords">
          LOC: {location.pathname} &nbsp;|&nbsp; CODE: 0x404 &nbsp;|&nbsp; STATUS: FATAL
        </div>
      </div>
    </>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

  @keyframes nf-glitch { /* ... keep your existing glitch keyframes */ }
  @keyframes nf-glitch2 { /* ... keep your existing glitch2 keyframes */ }
  @keyframes nf-scanline {
    0%   { top: -4px; }
    100% { top: 100%; }
  }
  @keyframes nf-flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
    20%, 24%, 55% { opacity: 0.4; }
  }
  @keyframes nf-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes nf-fadeup {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes nf-grid-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .nf-root {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #050810;
    overflow: hidden;
    font-family: 'Share Tech Mono', monospace;
    color: #c8d8e8;
    user-select: none;
  }

  /* Keep all your existing styles for .nf-grid, .nf-scanline, .nf-corner, .nf-badge, .nf-glitch-wrap, etc. */

  .nf-terminal {
    width: clamp(280px, 90%, 520px);
    background: rgba(0,255,204,0.03);
    border: 1px solid rgba(0,255,204,0.12);
    border-radius: 2px;
    padding: 16px 20px;
    margin-bottom: 40px;
    z-index: 2;
    min-height: 220px; /* Prevents layout shift when lines finish */
    position: relative;
  }

  .nf-term-line {
    font-size: 12px;
    line-height: 1.9;
    letter-spacing: 0.05em;
    animation: nf-fadeup 0.3s ease both;
  }

  .term-ok    { color: #00ffcc; }
  .term-warn  { color: #ffb300; }
  .term-error { color: #ff4060; }

  .nf-cursor {
    animation: nf-blink 0.7s steps(1) infinite;
    color: #00ffcc;
    font-size: 14px;
  }

  /* Final persistent cursor with subtle pulse when typing is done */
  .nf-cursor-final .nf-cursor {
    animation: nf-blink 1.2s steps(1) infinite;
    color: #00ffcc;
  }

  /* Your button and coords styles remain the same */
  .nf-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.2em;
    color: #050810;
    background: #00ffcc;
    padding: 12px 28px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.15s ease;
    z-index: 2;
    margin-bottom: 56px;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }

  .nf-btn-hovered {
    background: #ffffff;
    box-shadow: 0 0 24px rgba(0,255,204,0.6);
    transform: translateY(-1px);
  }

  .nf-btn-arrow { font-size: 10px; }

  .nf-coords {
    position: absolute;
    bottom: 20px;
    font-size: 10px;
    letter-spacing: 0.15em;
    color: rgba(200,216,232,0.25);
    z-index: 2;
  }
`;

export default NotFound;
