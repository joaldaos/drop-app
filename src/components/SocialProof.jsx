const tweets = [
  { user:'@alexm',    avatar:'🎧', text:'DROP changed how I discover music. My whole feed is fire tracks from people I actually know.',                         likes:'2.4k' },
  { user:'@sarahjxo', avatar:'🌸', text:'Can\'t believe I used to find music through algorithm playlists. Following real humans on DROP is 10x better.',         likes:'1.8k' },
  { user:'@leonardx', avatar:'🎸', text:'Showed up to a party and the DJ was playing exactly what my DROP feed had been showing all week. It\'s the future.',    likes:'4.1k' },
  { user:'@mia.wav',  avatar:'✨', text:'DROP is the only social app that made me feel less alone at 2am. Someone always playing something perfect.',             likes:'3.2k' },
  { user:'@kaibeats', avatar:'🎤', text:'I\'ve found 15 new artists through DROP this month alone. No ads, no sponsored playlists. Just real taste.',             likes:'2.9k' },
  { user:'@solenne_', avatar:'💜', text:'My friend group literally coordinates what we\'re listening to via DROP. It\'s our group chat for music.',               likes:'1.6k' },
]

export default function SocialProof() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">The community loves it</p>
          <h2 className="text-4xl md:text-5xl font-black">
            Real people,<br /><span className="gradient-text">real reactions.</span>
          </h2>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {tweets.map((t, i) => (
            <div key={i} className="card-glass rounded-2xl p-5 break-inside-avoid feature-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="avatar-ring">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background:'linear-gradient(135deg,#7e22ce,#be185d)' }}>
                    {t.avatar}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.user}</p>
                  <p className="text-xs text-gray-500">DROP user</p>
                </div>
                <div className="ml-auto text-xs text-gray-600">♥ {t.likes}</div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
