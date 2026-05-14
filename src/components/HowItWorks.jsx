const steps = [
  { num:'01', title:'Connect your music app', desc:'Link Spotify, Apple Music or any streaming service in seconds.' },
  { num:'02', title:'Follow your friends',    desc:'Find people you know — or discover strangers with killer taste.' },
  { num:'03', title:'Press play, then DROP',  desc:'The moment you start listening, it appears on your feed live.' },
]

export default function HowItWorks() {
  return (
    <section className="py-24" style={{ background:'rgba(147,51,234,0.03)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">Simple as that</p>
          <h2 className="text-4xl md:text-5xl font-black">How DROP works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px"
            style={{ background:'linear-gradient(90deg,transparent,rgba(147,51,234,0.5),transparent)' }} />
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black mb-6"
                style={{ background:'linear-gradient(135deg,rgba(147,51,234,0.2),rgba(236,72,153,0.2))', border:'1px solid rgba(147,51,234,0.3)' }}>
                <span className="gradient-text">{s.num}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
