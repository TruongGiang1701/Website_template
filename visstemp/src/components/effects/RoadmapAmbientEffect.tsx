type Particle = {
  id: string;
  left: string;
  top: string;
  size: string;
  duration: string;
  delay: string;
};

const particles: Particle[] = [
  { id: "p1", left: "6%", top: "16%", size: "10px", duration: "8s", delay: "0s" },
  { id: "p2", left: "14%", top: "42%", size: "8px", duration: "7s", delay: "-1.5s" },
  { id: "p3", left: "22%", top: "28%", size: "14px", duration: "9s", delay: "-3s" },
  { id: "p4", left: "30%", top: "68%", size: "9px", duration: "6.5s", delay: "-2s" },
  { id: "p5", left: "38%", top: "18%", size: "12px", duration: "10s", delay: "-4s" },
  { id: "p6", left: "44%", top: "54%", size: "7px", duration: "7.5s", delay: "-2.5s" },
  { id: "p7", left: "52%", top: "26%", size: "11px", duration: "8.5s", delay: "-5s" },
  { id: "p8", left: "60%", top: "72%", size: "8px", duration: "6.8s", delay: "-1s" },
  { id: "p9", left: "68%", top: "20%", size: "13px", duration: "9.2s", delay: "-3.8s" },
  { id: "p10", left: "76%", top: "46%", size: "8px", duration: "7.2s", delay: "-0.8s" },
  {
    id: "p11",
    left: "84%",
    top: "24%",
    size: "10px",
    duration: "8.8s",
    delay: "-2.2s",
  },
  { id: "p12", left: "90%", top: "62%", size: "9px", duration: "6.6s", delay: "-4.1s" },
  { id: "p13", left: "10%", top: "78%", size: "7px", duration: "7.8s", delay: "-5.2s" },
  {
    id: "p14",
    left: "26%",
    top: "84%",
    size: "10px",
    duration: "8.2s",
    delay: "-2.7s",
  },
  {
    id: "p15",
    left: "48%",
    top: "82%",
    size: "12px",
    duration: "9.8s",
    delay: "-1.9s",
  },
  { id: "p16", left: "64%", top: "86%", size: "7px", duration: "6.9s", delay: "-3.3s" },
  {
    id: "p17",
    left: "80%",
    top: "80%",
    size: "11px",
    duration: "8.6s",
    delay: "-4.6s",
  },
  { id: "p18", left: "93%", top: "36%", size: "8px", duration: "7.4s", delay: "-2.9s" },
];

export function RoadmapAmbientEffect() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="roadmap-aurora roadmap-aurora-a" />
      <div className="roadmap-aurora roadmap-aurora-b" />
      <div className="roadmap-aurora roadmap-aurora-c" />

      <div className="roadmap-beam roadmap-beam-a" />
      <div className="roadmap-beam roadmap-beam-b" />
      <div className="roadmap-beam roadmap-beam-c" />

      {particles.map((particle) => (
        <span
          key={particle.id}
          className="roadmap-particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDuration: particle.duration,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
