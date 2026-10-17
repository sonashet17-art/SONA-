import React from 'react';

export const BotDoctorHandshakeIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-44" }) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-cyan-500/15 p-4 border border-teal-200/40 dark:border-teal-700/30 ${className}`}>
      {/* Background Pulse Line & Ambient Aura */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 160">
        <path
          d="M0,80 L90,80 L110,40 L125,120 L140,70 L155,90 L170,80 L400,80"
          fill="none"
          stroke="#0d9488"
          strokeWidth="2.5"
          strokeDasharray="6 4"
        />
        <circle cx="200" cy="80" r="60" fill="#14b8a6" filter="blur(30px)" opacity="0.3" />
      </svg>

      {/* Main Vector Artwork: Bot handshaking doctor */}
      <svg viewBox="0 0 320 180" className="w-full h-full max-h-48 drop-shadow-md select-none">
        <defs>
          <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="glowTeal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Central Handshake Energy Radiance */}
        <circle cx="160" cy="115" r="24" fill="#2dd4bf" opacity="0.25" />
        <circle cx="160" cy="115" r="14" fill="#99f6e4" opacity="0.4" />
        <path d="M150,115 L170,115 M160,105 L160,125" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />

        {/* --- LEFT: AI Medical Bot --- */}
        <g id="bot">
          {/* Antenna */}
          <line x1="85" y1="50" x2="85" y2="35" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          <circle cx="85" cy="32" r="5" fill="#38bdf8" />
          <circle cx="85" cy="32" r="8" fill="#38bdf8" opacity="0.3" />

          {/* Bot Head */}
          <rect x="60" y="50" width="50" height="42" rx="12" fill="url(#botGrad)" stroke="#0369a1" strokeWidth="2" />
          {/* Bot Visor / Eyes */}
          <rect x="68" y="62" width="34" height="15" rx="6" fill="#0f172a" />
          <circle cx="77" cy="69" r="3.5" fill="#38bdf8" />
          <circle cx="93" cy="69" r="3.5" fill="#38bdf8" />
          {/* Bot Mouth Smile */}
          <path d="M78,83 Q85,87 92,83" fill="none" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />

          {/* Bot Body */}
          <path d="M52,98 C52,94 65,92 85,92 C105,92 118,94 118,98 L124,155 C124,160 114,165 85,165 C56,165 46,160 46,155 Z" fill="#0369a1" stroke="#082f49" strokeWidth="1.5" />
          {/* Medical Cross on Bot Chest */}
          <circle cx="85" cy="125" r="14" fill="#ffffff" />
          <rect x="82" y="117" width="6" height="16" rx="2" fill="#0d9488" />
          <rect x="77" y="122" width="16" height="6" rx="2" fill="#0d9488" />

          {/* Bot Right Arm extending to Handshake */}
          <path d="M110,108 Q130,110 148,114" fill="none" stroke="#0284c7" strokeWidth="9" strokeLinecap="round" />
          {/* Bot Metallic Hand */}
          <path d="M148,114 L158,115" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* --- RIGHT: Professional Doctor --- */}
        <g id="doctor">
          {/* Doctor Hair / Head */}
          <circle cx="235" cy="52" r="20" fill="#fcd34d" />
          {/* Hair silhouette */}
          <path d="M216,50 C216,34 254,34 254,50 C254,42 245,36 235,36 C225,36 218,42 216,50 Z" fill="#475569" />
          {/* Gentle Doctor Face */}
          <circle cx="235" cy="54" r="16" fill="#fed7aa" />
          {/* Doctor smile and glasses/eyes */}
          <circle cx="229" cy="52" r="2" fill="#1e293b" />
          <circle cx="241" cy="52" r="2" fill="#1e293b" />
          <path d="M231,60 Q235,63 239,60" fill="none" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />

          {/* Doctor White Coat */}
          <path d="M202,96 C202,92 215,90 235,90 C255,90 268,92 268,96 L274,155 C274,160 264,165 235,165 C206,165 196,160 196,155 Z" fill="url(#docGrad)" stroke="#cbd5e1" strokeWidth="2" />
          {/* Blue Shirt collar & tie */}
          <polygon points="235,90 227,105 243,105" fill="#0284c7" />
          <polygon points="235,103 232,122 235,126 238,122" fill="#0f766e" />

          {/* Stethoscope */}
          <path d="M222,96 Q220,126 235,134 Q250,126 248,96" fill="none" stroke="#334155" strokeWidth="2.5" />
          <circle cx="235" cy="136" r="4.5" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />

          {/* Doctor Left Arm extending to Handshake */}
          <path d="M210,108 Q190,110 170,114" fill="none" stroke="#f1f5f9" strokeWidth="9" strokeLinecap="round" />
          {/* Doctor Hand clasping */}
          <path d="M172,114 L160,115" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* Handshake fingers interlocking */}
        <path d="M155,112 Q160,118 165,112" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        {/* Partnership Sparkle */}
        <polygon points="160,93 162,99 168,101 162,103 160,109 158,103 152,101 158,99" fill="#059669" />
      </svg>
    </div>
  );
};

export const BotStudentComfortIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-44" }) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/15 p-4 border border-indigo-200/40 dark:border-indigo-700/30 ${className}`}>
      {/* Background Calm Rays */}
      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 400 160">
        <circle cx="160" cy="80" r="70" fill="#818cf8" filter="blur(35px)" opacity="0.3" />
        <circle cx="260" cy="50" r="50" fill="#f472b6" filter="blur(30px)" opacity="0.2" />
      </svg>

      {/* Main Vector Artwork: A bot comforting a student */}
      <svg viewBox="0 0 320 180" className="w-full h-full max-h-48 drop-shadow-md select-none">
        <defs>
          <linearGradient id="warmBot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="studentJacket" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>
          <linearGradient id="deskWood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        {/* Study Desk surface */}
        <path d="M120,140 L305,140 L295,165 L115,165 Z" fill="#cbd5e1" opacity="0.7" />
        <line x1="120" y1="140" x2="305" y2="140" stroke="#94a3b8" strokeWidth="3" />

        {/* Open Study Book on desk */}
        <polygon points="215,138 238,131 260,138 238,143" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        <polygon points="192,138 215,131 238,138 215,143" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
        <line x1="215" y1="131" x2="215" y2="143" stroke="#64748b" strokeWidth="1.5" />

        {/* Little Desk Lamp glowing warm yellow */}
        <path d="M280,140 L280,110 L270,105" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
        <polygon points="262,100 278,100 284,112 256,112" fill="#fbbf24" opacity="0.9" />
        <polygon points="248,140 292,140 270,112" fill="#fef08a" opacity="0.25" />

        {/* --- STUDENT SITTING AT DESK (Center-Right) --- */}
        <g id="student">
          {/* Student Chair Back */}
          <rect x="220" y="80" width="8" height="65" rx="3" fill="#475569" opacity="0.4" />

          {/* Student Head bowed slightly down in stress/tiredness */}
          <circle cx="195" cy="74" r="18" fill="#fed7aa" />
          {/* Student hair */}
          <path d="M180,68 C180,50 212,50 214,68 C208,60 196,58 188,62 Z" fill="#334155" />
          {/* Tired gentle face looking down */}
          <path d="M196,73 Q199,75 202,73" fill="none" stroke="#475569" strokeWidth="1.5" />
          <path d="M197,80 Q201,78 205,80" fill="none" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />

          {/* Student Body (slumped gently over desk) */}
          <path d="M178,92 C178,92 195,88 212,92 L220,140 C220,140 195,142 174,140 Z" fill="url(#studentJacket)" />

          {/* Student Arm resting on desk */}
          <path d="M195,96 Q215,115 220,138" fill="none" stroke="#db2777" strokeWidth="7" strokeLinecap="round" />
          <circle cx="220" cy="138" r="4.5" fill="#fed7aa" />
        </g>

        {/* --- CARING BOT (Left) COMFORTING STUDENT --- */}
        <g id="comfort-bot">
          {/* Bot Antenna with warm glowing heart */}
          <line x1="105" y1="46" x2="105" y2="30" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
          <circle cx="105" cy="28" r="5" fill="#f43f5e" />
          <circle cx="105" cy="28" r="9" fill="#f43f5e" opacity="0.35" />

          {/* Bot Head tilted with care */}
          <g transform="rotate(8 105 60)">
            <rect x="80" y="44" width="50" height="42" rx="12" fill="url(#warmBot)" stroke="#4338ca" strokeWidth="2" />
            {/* Friendly empathetic digital eyes */}
            <rect x="88" y="55" width="34" height="15" rx="6" fill="#0f172a" />
            {/* Curved warm caring eyes */}
            <path d="M93,65 Q97,60 101,65" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
            <path d="M109,65 Q113,60 117,65" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
            {/* Warm soft smile */}
            <path d="M98,75 Q105,79 112,75" fill="none" stroke="#e0e7ff" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Bot Torso */}
          <path d="M78,90 C78,86 92,84 112,84 C132,84 142,86 142,90 L146,155 C146,160 135,165 110,165 C85,165 74,160 74,155 Z" fill="#4338ca" />

          {/* Glowing Heart on Bot Chest */}
          <circle cx="110" cy="118" r="14" fill="#312e81" />
          <path
            d="M110,123 C110,123 103,117 103,113 C103,110 106,108 109,110 C110,111 110,111 110,111 C110,111 110,111 111,110 C114,108 117,110 117,113 C117,117 110,123 110,123 Z"
            fill="#f43f5e"
          />

          {/* Bot Arm reaching out and resting gently on the student's shoulder */}
          <path
            d="M130,98 Q155,95 182,92"
            fill="none"
            stroke="#6366f1"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Bot caring hand gently patting/holding student's shoulder */}
          <circle cx="184" cy="92" r="6" fill="#a5b4fc" />
          {/* Warm touch aura on shoulder */}
          <circle cx="184" cy="92" r="11" fill="#ec4899" opacity="0.3" />
        </g>

        {/* Empathy Floating Hearts / Sparkles */}
        <polygon points="160,50 162,55 167,56 162,58 160,63 158,58 153,56 158,55" fill="#f43f5e" opacity="0.8" />
        <polygon points="145,35 146,39 150,40 146,41 145,45 144,41 140,40 144,39" fill="#818cf8" opacity="0.7" />
        <polygon points="215,40 216,43 219,44 216,45 215,48 214,45 211,44 214,43" fill="#fbbf24" opacity="0.75" />
      </svg>
    </div>
  );
};
