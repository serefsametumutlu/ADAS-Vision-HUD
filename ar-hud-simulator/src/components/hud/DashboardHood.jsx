export default function DashboardHood() {
  return (
    <div className="fixed inset-0 z-[9] pointer-events-none">
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          {/* ── Gradients ───────────────────────────────────────────── */}
          <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0a1520" stopOpacity="0.0" />
            <stop offset="40%"  stopColor="#0c1825" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#070e16" stopOpacity="1" />
          </linearGradient>

          {/* Dashboard surface — dark textured look */}
          <linearGradient id="dashSurface" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#182534" stopOpacity="1" />
            <stop offset="50%"  stopColor="#101c28" stopOpacity="1" />
            <stop offset="100%" stopColor="#080f18" stopOpacity="1" />
          </linearGradient>

          {/* Highlight strip along dashboard top */}
          <linearGradient id="dashHighlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#243545" stopOpacity="1" />
            <stop offset="100%" stopColor="#182534" stopOpacity="0" />
          </linearGradient>

          {/* Left A-pillar — solid dark with slight gradient */}
          <linearGradient id="pillarLeft" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%"   stopColor="#111e2a" stopOpacity="0" />
            <stop offset="60%"  stopColor="#0a1520" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#06101a" stopOpacity="0.97" />
          </linearGradient>

          <linearGradient id="pillarRight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#111e2a" stopOpacity="0" />
            <stop offset="60%"  stopColor="#0a1520" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#06101a" stopOpacity="0.97" />
          </linearGradient>

          {/* Windshield top vignette */}
          <linearGradient id="topVignette" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#020608" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#020608" stopOpacity="0" />
          </linearGradient>

          {/* Steering wheel rim */}
          <radialGradient id="rimLight" cx="35%" cy="20%" r="55%">
            <stop offset="0%"   stopColor="#2e4458" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#111e2a" stopOpacity="0" />
          </radialGradient>

          {/* Hub */}
          <radialGradient id="hubFill" cx="38%" cy="32%" r="62%">
            <stop offset="0%"   stopColor="#243040" />
            <stop offset="100%" stopColor="#0d1820" />
          </radialGradient>

          {/* Infotainment screen */}
          <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0d2535" stopOpacity="1" />
            <stop offset="100%" stopColor="#081520" stopOpacity="1" />
          </linearGradient>

          {/* Clip for steering wheel */}
          <clipPath id="wheelClip">
            <rect x="0" y="700" width="1920" height="380" />
          </clipPath>
        </defs>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* TOP WINDSHIELD VIGNETTE                                     */}
        {/* ─────────────────────────────────────────────────────────── */}
        <rect x="0" y="0" width="1920" height="90" fill="url(#topVignette)" />

        {/* ─────────────────────────────────────────────────────────── */}
        {/* LEFT A-PILLAR                                               */}
        {/* ─────────────────────────────────────────────────────────── */}
        {/* Main pillar body */}
        <path d="M 0 0 L 260 710 L 0 1080 Z" fill="url(#pillarLeft)" />
        {/* Pillar inner edge — thin highlight */}
        <path d="M 0 0 L 260 710"
          fill="none" stroke="rgba(40,65,85,0.55)" strokeWidth="2.5" />

        {/* ─────────────────────────────────────────────────────────── */}
        {/* RIGHT A-PILLAR                                              */}
        {/* ─────────────────────────────────────────────────────────── */}
        <path d="M 1920 0 L 1660 710 L 1920 1080 Z" fill="url(#pillarRight)" />
        <path d="M 1920 0 L 1660 710"
          fill="none" stroke="rgba(40,65,85,0.55)" strokeWidth="2.5" />

        {/* ─────────────────────────────────────────────────────────── */}
        {/* DASHBOARD MAIN BODY                                         */}
        {/* ─────────────────────────────────────────────────────────── */}
        {/* Background fill from windshield base down */}
        <path
          d="M 0 1080 L 0 780
             Q 200 730 480 715
             Q 720 703 960 700
             Q 1200 703 1440 715
             Q 1720 730 1920 780
             L 1920 1080 Z"
          fill="url(#dashFill)"
        />

        {/* Solid dashboard surface (below the curve) */}
        <path
          d="M 0 1080 L 0 800
             Q 200 750 480 734
             Q 720 722 960 719
             Q 1200 722 1440 734
             Q 1720 750 1920 800
             L 1920 1080 Z"
          fill="url(#dashSurface)"
        />

        {/* Dashboard top edge highlight band */}
        <path
          d="M 0 800
             Q 200 750 480 734
             Q 720 722 960 719
             Q 1200 722 1440 734
             Q 1720 750 1920 800
             L 1920 830
             Q 1720 780 1440 764
             Q 1200 752 960 749
             Q 720 752 480 764
             Q 200 780 0 830 Z"
          fill="url(#dashHighlight)"
        />

        {/* Cyan accent trim line */}
        <path
          d="M 0 800 Q 200 750 480 734 Q 720 722 960 719 Q 1200 722 1440 734 Q 1720 750 1920 800"
          fill="none" stroke="rgba(0,240,200,0.22)" strokeWidth="1.8"
        />
        {/* Secondary dim trim */}
        <path
          d="M 40 808 Q 220 760 480 744 Q 720 732 960 729 Q 1200 732 1440 744 Q 1700 760 1880 808"
          fill="none" stroke="rgba(0,240,200,0.06)" strokeWidth="1"
        />

        {/* ─────────────────────────────────────────────────────────── */}
        {/* INSTRUMENT CLUSTER BROW (left)                              */}
        {/* ─────────────────────────────────────────────────────────── */}
        <path
          d="M 220 1080 L 240 870 Q 360 840 520 832 Q 620 829 680 832 L 700 852 L 720 1080 Z"
          fill="rgba(6,12,20,0.7)"
        />
        <path
          d="M 240 870 Q 360 840 520 832 Q 620 829 680 832 L 700 850
             Q 660 847 520 852 Q 370 858 250 888 Z"
          fill="rgba(24,38,50,0.45)"
        />

        {/* ─────────────────────────────────────────────────────────── */}
        {/* CENTER INFOTAINMENT SCREEN                                  */}
        {/* ─────────────────────────────────────────────────────────── */}
        <rect x="808" y="760" width="304" height="195" rx="6"
          fill="rgba(5,10,16,0.5)" />
        <rect x="812" y="764" width="296" height="187" rx="4"
          fill="url(#screenGlow)" stroke="rgba(0,240,200,0.08)" strokeWidth="1" />
        {/* Screen inner bezel */}
        <rect x="818" y="770" width="284" height="175" rx="3"
          fill="rgba(8,18,28,0.9)" stroke="rgba(0,240,200,0.04)" strokeWidth="1" />
        {/* Screen content hint — subtle cyan lines */}
        <line x1="850" y1="800" x2="1070" y2="800" stroke="rgba(0,240,200,0.10)" strokeWidth="1" />
        <line x1="850" y1="820" x2="1070" y2="820" stroke="rgba(0,240,200,0.06)" strokeWidth="1" />
        <line x1="850" y1="840" x2="1020" y2="840" stroke="rgba(0,240,200,0.06)" strokeWidth="1" />
        {/* Screen logo */}
        <circle cx="960" cy="878" r="18" fill="none" stroke="rgba(0,240,200,0.15)" strokeWidth="1.5" />
        <text x="960" y="883" textAnchor="middle" fill="rgba(0,240,200,0.25)"
          fontSize="10" fontFamily="monospace" letterSpacing="1">NAV</text>

        {/* Bezel knob hints */}
        <circle cx="820" cy="880" r="8" fill="rgba(20,32,44,0.8)" stroke="rgba(40,60,80,0.5)" strokeWidth="1" />
        <circle cx="1100" cy="880" r="8" fill="rgba(20,32,44,0.8)" stroke="rgba(40,60,80,0.5)" strokeWidth="1" />

        {/* ─────────────────────────────────────────────────────────── */}
        {/* STEERING WHEEL  (center: 455, 1005 — upper portion visible) */}
        {/* ─────────────────────────────────────────────────────────── */}
        <g clipPath="url(#wheelClip)">
          <g transform="translate(455 1005)">
            {/* Shadow behind wheel */}
            <circle cx="4" cy="6" r="166" fill="rgba(0,0,0,0.5)" />

            {/* Outer rim — layered for depth */}
            <circle cx="0" cy="0" r="162" fill="none" stroke="#060e16" strokeWidth="38" />
            <circle cx="0" cy="0" r="162" fill="none" stroke="#101c2a" strokeWidth="30" />
            <circle cx="0" cy="0" r="162" fill="none" stroke="#182838" strokeWidth="22" />
            {/* Rim glare */}
            <circle cx="0" cy="0" r="162" fill="none" stroke="url(#rimLight)" strokeWidth="20" />
            {/* Rim inner / outer edge lines */}
            <circle cx="0" cy="0" r="148" fill="none" stroke="rgba(8,18,28,0.9)" strokeWidth="2" />
            <circle cx="0" cy="0" r="176" fill="none" stroke="rgba(8,18,28,0.7)" strokeWidth="2" />

            {/* ── 3-spoke design ── */}
            {/* Left spoke */}
            <path d="M -134 -78 Q -62 -24 -42 0 Q -62 24 -134 78"
              fill="#0f1e2c" stroke="#1a2e40" strokeWidth="2" strokeLinejoin="round" />
            {/* Right spoke */}
            <path d="M 134 -78 Q 62 -24 42 0 Q 62 24 134 78"
              fill="#0f1e2c" stroke="#1a2e40" strokeWidth="2" strokeLinejoin="round" />
            {/* Bottom spoke (driver's side) */}
            <path d="M -32 150 Q -14 60 0 44 Q 14 60 32 150"
              fill="#0f1e2c" stroke="#1a2e40" strokeWidth="2" strokeLinejoin="round" />

            {/* Flat-bottom cutout hints */}
            <path d="M -134 78 Q -60 100 0 105 Q 60 100 134 78"
              fill="none" stroke="rgba(8,18,28,0.4)" strokeWidth="1" />

            {/* Hub center */}
            <circle cx="0" cy="0" r="42" fill="url(#hubFill)" stroke="#1a2e40" strokeWidth="2" />
            <circle cx="0" cy="0" r="30" fill="#0c1820" />
            {/* Logo hex */}
            <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8"
              fill="none" stroke="rgba(0,240,200,0.40)" strokeWidth="1.8" />
            <circle cx="0" cy="0" r="4" fill="rgba(0,240,200,0.55)" />

            {/* Subtle steering column shadow below */}
            <rect x="-22" y="165" width="44" height="60" rx="8"
              fill="rgba(6,12,20,0.7)" />
          </g>
        </g>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* REARVIEW MIRROR                                             */}
        {/* ─────────────────────────────────────────────────────────── */}
        <rect x="855" y="0" width="210" height="52" rx="5"
          fill="rgba(4,9,14,0.6)" />
        <rect x="862" y="3" width="196" height="44" rx="4"
          fill="rgba(10,20,30,0.55)" stroke="rgba(30,50,65,0.5)" strokeWidth="1" />
        {/* Mirror glass */}
        <rect x="868" y="7" width="184" height="34" rx="3"
          fill="rgba(14,26,38,0.85)" stroke="rgba(0,240,200,0.06)" strokeWidth="1" />
        {/* Stem */}
        <rect x="945" y="49" width="30" height="22"
          fill="rgba(6,12,20,0.8)" />
        <rect x="950" y="68" width="20" height="18"
          fill="rgba(6,12,20,0.8)" />
      </svg>
    </div>
  );
}
