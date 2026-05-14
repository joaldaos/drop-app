const features = [
  { icon:'⚡', title:'Real-Time Drops',   color:'#9333ea', desc:'Your track appears on your friends\' feed the second you hit play. No delays, no manual updates — just pure, instant sharing.' },
  { icon:'👥', title:'Follow & Discover', color:'#ec4899', desc:'Build your music circle. See what your people are into, find new artists through their taste, and vibe together.' },
  { icon:'🎯', title:'Taste DNA',         color:'#f97316', desc:'Your profile shows your music identity — top genres, listening streaks, and a visual timeline of everything you\'ve dropped.' },
  { icon:'🔔', title:'Drop Alerts',       color:'#1db954', desc:'Get notified when someone you follow drops a banger. Never miss a moment in your crew\'s music life.' },
  { icon:'🎵', title:'Universal Sync',    color:'#3b82f6', desc:'Works with Spotify, Apple Music, YouTube Music, and more. Whatever you play, DROP picks it up automatically.' },
  { icon:'🔥', title:'Trend Rooms',       color:'#ef4444', desc:'Join live rooms where hundreds of people drop the same vibe. From lo-fi study sessions to club-ready bangers.' },
]

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute rounded-full pointer-events-none" style={{ width:400, height:400, background:'rgba(236,72,153,0.08)', filter:'blur(80px)', top:'20%', right:0 }} />
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">What makes DROP different</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Music is better<br /><span className="gradient-text">when it's shared.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Built for people who believe music is a conversation, not a solo sport.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card-glass rounded-2xl p-6 feature-card cursor-default">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background:`${f.color}20`, border:`1px solid ${f.color}40` }}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
