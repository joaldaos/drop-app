const stats = [
  { value:'2M+',  label:'Active Listeners' },
  { value:'50M+', label:'Tracks Dropped'   },
  { value:'40+',  label:'Countries'        },
  { value:'4.9★', label:'App Store Rating' },
]

export default function Stats() {
  return (
    <section className="py-16" style={{ background:'linear-gradient(135deg,rgba(147,51,234,0.1),rgba(236,72,153,0.05))' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl md:text-5xl font-black gradient-text mb-1">{s.value}</p>
              <p className="text-gray-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
