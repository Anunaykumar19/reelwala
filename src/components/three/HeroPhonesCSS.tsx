"use client";
// Lightweight CSS-3D fallback for low-end devices / reduced motion
export default function HeroPhonesCSS({ videos }: { videos: string[] }) {
  const items = [
    { src: videos[0], style: "translate(-50%,-50%) rotateY(-14deg) rotateX(4deg)", z: 2, w: "w-44 md:w-56", top: "50%", left: "50%" },
    { src: videos[1], style: "translate(-50%,-50%) rotateY(22deg) rotateX(6deg) scale(.82)", z: 1, w: "w-40 md:w-48", top: "46%", left: "22%" },
    { src: videos[2], style: "translate(-50%,-50%) rotateY(-24deg) rotateX(-4deg) scale(.8)", z: 1, w: "w-40 md:w-48", top: "58%", left: "78%" },
  ];
  return (
    <div className="absolute inset-0 [perspective:1200px]">
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-transparent [background:linear-gradient(#0A0A0F,#0A0A0F)_padding-box,linear-gradient(100deg,#7C3AED,#EC4899,#F97316)_border-box] opacity-70 blur-[2px] animate-spin-slow" />
      {items.map((p, i) => (
        <div key={i} className={`absolute ${p.w} aspect-[9/19] rounded-[2rem] bg-[#15151f] p-1.5 shadow-glow animate-float`} style={{ top: p.top, left: p.left, transform: p.style, zIndex: p.z, animationDelay: `${i * 0.8}s` }}>
          <video src={p.src} muted loop autoPlay playsInline className="h-full w-full rounded-[1.6rem] object-cover" />
        </div>
      ))}
    </div>
  );
}
