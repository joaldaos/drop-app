import PhoneMockup from './PhoneMockup'

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.39.07 2.35.74 3.16.8 1.2-.23 2.35-.93 3.63-.84 1.54.13 2.71.74 3.47 1.89-3.19 1.91-2.66 6.37.74 7.73-.49 1.21-1.09 2.4-3 3.28zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.18 23.76c.26.13.56.13.82 0L12 18.88l-8-4.88V23.76zM12 18.88l8.82-5.38a.75.75 0 000-1.3L12 6.82 3.18 12.2a.75.75 0 000 1.3L12 18.88zM12 .36L1.13 6.75a.75.75 0 000 1.3L12 14.43l10.87-6.38a.75.75 0 000-1.3L12 .36z"/>
  </svg>
)

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute rounded-full pointer-events-none" style={{ width:500, height:500, background:'rgba(147,51,234,0.15)', filter:'blur(80px)', top:'10%', left:'-10%' }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width:400, height:400, background:'rgba(236,72,153,0.1)', filter:'blur(80px)', top:'20%', right:'-5%' }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width:300, height:300, background:'rgba(249,115,22,0.08)', filter:'blur(80px)', bottom:'10%', left:'40%' }} />
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage:'linear-gradient(rgba(147,51,234,0.5) 1px, transparent 1px), linear-gradient(90deg,rgba(147,51,234,0.5) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />

      <div className="relative max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium mb-6"
            style={{ background:'rgba(147,51,234,0.15)', border:'1px solid rgba(147,51,234,0.3)', color:'#c084fc' }}>
            <div className="status-dot" style={{ width:6, height:6 }} />
            Now live in 40+ countries
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none mb-6">
            Share the music<br /><span className="gradient-text">you live for.</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
            DROP lets you broadcast what you're listening to — in real time.
            Follow friends, discover music through people, not algorithms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a id="download" href="#" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white no-underline">
              <AppleIcon /> App Store
            </a>
            <a href="#" className="btn-outline inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white no-underline"
              style={{ border:'1px solid rgba(147,51,234,0.5)', transition:'all 0.3s ease' }}>
              <GoogleIcon /> Google Play
            </a>
          </div>
          <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
            <div className="flex -space-x-3">
              {['👩🏻','👨🏽','👩🏿','👨🏼','👩🏾'].map((e, i) => (
                <div key={i} className="avatar-ring" style={{ zIndex: 5-i }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-base"
                    style={{ background:'linear-gradient(135deg,#7e22ce,#be185d)' }}>
                    {e}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold">2M+ listeners</p>
              <p className="text-xs text-gray-500">dropping tracks right now</p>
            </div>
          </div>
        </div>

        <div className="relative flex-shrink-0" style={{ width:300, height:520 }}>
          <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}>
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
