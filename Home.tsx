import { Link } from "wouter";
import { useAuth } from "./useAuth";
import { trpc } from "./main";

const STATS = [
  { value: '500+', label: 'Active Servers' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
  { value: '1,000+', label: 'Happy Clients' },
];

const FEATURES = [
  {
    icon: '🖥️',
    title: 'Pterodactyl Panels',
    desc: 'Deploy game servers instantly with full Pterodactyl panel access. Choose your resources and go live in minutes.',
    href: '/products',
    cta: 'View Plans',
  },
  {
    icon: '🤖',
    title: 'Telegram Bots',
    desc: 'Deploy and manage Telegram bots with ease. Automate your workflows and engage your audience 24/7.',
    href: '/products',
    cta: 'Deploy Bot',
  },
  {
    icon: '💳',
    title: 'Wallet System',
    desc: 'Top up via M-Pesa, Paystack, or Crypto and deploy instantly — no repeated checkout, just one balance for everything.',
    href: '/wallet',
    cta: 'Top Up',
  },
];

function fmtCpu(v: any) {
  const n = parseInt(v);
  return n === 0 ? 'Unlimited CPU' : `${n}% CPU`;
}

function fmtRam(v: any) {
  const n = parseInt(v);
  return n === 0 ? 'Unlimited RAM' : n >= 1024 ? `${n / 1024} GB RAM` : `${n} MB RAM`;
}

function fmtDisk(v: any) {
  const n = parseInt(v);
  return n === 0 ? 'Unlimited Disk' : n >= 1024 ? `${n / 1024} GB Disk` : `${n} GB`;
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: productsData } = trpc.products.list.useQuery();
  
  // Use products from database or fallback to default packages
  const packages = productsData?.products || [];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>

      {/* ─── HERO / LANDING PAGE WITH BACKGROUND IMAGE ─── */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center"
        style={{
          background: `
            linear-gradient(180deg, rgba(7,20,40,0.88) 0%, rgba(10,10,15,0.92) 100%),
            url('./background.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow blobs */}
        <div
          className="absolute top-16 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-56 sm:w-80 h-56 sm:h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />

        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24 text-center">

          {/* Headline */}
          <h1
            className="font-extrabold mb-4 sm:mb-6 leading-tight"
            style={{
              fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
              color: '#f0f4ff',
            }}
          >
            𝐓𝐇𝐄 𝐅𝐔𝐓𝐔𝐑𝐄 𝐒𝐓𝐀𝐑𝐓𝐒 𝐀𝐓
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #c084fc, #7c3aed, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              𝐁𝐋𝐀𝐂𝐊𝐋𝐎𝐑𝐃 𝐓𝐄𝐂𝐇
            </span>
          </h1>

          {/* Description */}
          <p
            className="mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-2"
            style={{ color: '#94a3b8' }}
          >
            <i>
              From cloud hosting to intelligent automation, we deliver technology that
              drives success. <strong style={{ color: '#c084fc' }}>
                Whether you're a creator, startup, or established business,
              </strong>{' '}
              our powerful Pterodactyl hosting, advanced automation, and innovative
              digital solutions are designed to help you scale with confidence.
            </i>
          </p>

          {/* Circle Badge */}
          <div className="circle-badge" style={{
            display: 'inline-block',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.2))',
            border: '2px solid rgba(124,58,237,0.3)',
            padding: '20px',
            marginBottom: '20px',
            position: 'relative',
          }}>
            <span className="badge-text" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#c084fc',
              textAlign: 'center',
              lineHeight: '1.4',
            }}>
              𝐁𝐋𝐀𝐂𝐊𝐋𝐎𝐑𝐃
              <br />
              𝐓𝐄𝐂𝐇,
              <br />
              <span className="small" style={{ fontSize: '10px', color: '#64748b' }}>𝐈𝐍𝐂𝐎𝐑𝐏𝐎𝐑𝐀𝐓𝐄𝐃</span>
            </span>
          </div>

          {/* ─── CTA BUTTONS ─── */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0 mt-6">
            <Link
              href="/products"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white text-base transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                boxShadow: '0 0 28px rgba(124,58,237,0.45)',
                textDecoration: 'none',
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              🚀 Deploy a Panel
            </Link>
            <Link
              href={isAuthenticated ? "/dashboard" : "/dashboard"}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#f0f4ff',
                border: '1px solid #1e2d4a',
                textDecoration: 'none',
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              🔥 Get Started
            </Link>
          </div>

          {/* Trust Strip */}
          <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-8">
            {[
              { icon: '⚡', text: 'Instant Deployment' },
              { icon: '🔒', text: 'Secure & Reliable' },
              { icon: '💬', text: '24/7 Support' },
            ].map((t) => (
              <div
                key={t.text}
                className="flex items-center gap-2 text-xs sm:text-sm"
                style={{ color: '#475569' }}
              >
                <span>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section
        className="py-10 sm:py-14"
        style={{
          backgroundColor: '#0a0a0f',
          borderTop: '1px solid #0d1120',
          borderBottom: '1px solid #0d1120',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p
                  className="font-extrabold mb-1"
                  style={{
                    fontSize: 'clamp(1.6rem, 4vw, 2rem)',
                    color: '#f0f4ff',
                  }}
                >
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm" style={{ color: '#475569' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <p
              className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#7c3aed' }}
            >
              What We Offer
            </p>
            <h2
              className="font-extrabold mb-4"
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
                color: '#f0f4ff',
              }}
            >
              Everything You Need
            </h2>
            <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: '#64748b' }}>
              From game servers to Telegram bots — deploy, manage, and scale your
              digital infrastructure in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 group"
                style={{
                  backgroundColor: '#0f1629',
                  border: '1px solid #1e2d4a',
                }}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-base sm:text-lg mb-2" style={{ color: '#f0f4ff' }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#64748b' }}>
                  {f.desc}
                </p>
                <Link
                  href={f.href}
                  className="inline-flex items-center gap-1 text-sm font-semibold transition-all"
                  style={{ color: '#7c3aed', textDecoration: 'none' }}
                >
                  {f.cta}{' '}
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING / PANELS SECTION ─── */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: '#0d0d1a' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <p
              className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#7c3aed' }}
            >
              Panel Plans
            </p>
            <h2
              className="font-extrabold mb-4"
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
                color: '#f0f4ff',
              }}
            >
              Simple, Honest Pricing
            </h2>
            <p className="text-sm sm:text-base" style={{ color: '#64748b' }}>
              Pay per month. Cancel anytime. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
            {packages.length > 0 ? packages.map((pkg: any) => (
              <div
                key={pkg.id}
                className="relative rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: pkg.popular ? '#1a1035' : '#0f1629',
                  border: `1px solid ${pkg.popular ? (pkg.accent || '#7c3aed') : '#1e2d4a'}`,
                  boxShadow: pkg.popular
                    ? `0 0 30px rgba(124,58,237,0.2)`
                    : 'none',
                }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{
                        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                      }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <p className="font-bold text-base sm:text-lg mb-1" style={{ color: '#f0f4ff' }}>
                    {pkg.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-extrabold"
                      style={{
                        fontSize: 'clamp(1.8rem, 5vw, 2.25rem)',
                        color: pkg.popular ? '#c084fc' : '#f0f4ff',
                      }}
                    >
                      KSH {parseFloat(pkg.price).toFixed(0)}
                    </span>
                    <span className="text-xs" style={{ color: '#475569' }}>
                      /mo
                    </span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {[
                    fmtCpu(pkg.cpu || 100),
                    fmtRam(pkg.memory || 1024),
                    fmtDisk(pkg.disk || 5120),
                    pkg.databases ? `${pkg.databases} Databases` : null,
                    pkg.backups ? `${pkg.backups} Backups` : null,
                  ].filter(Boolean).map((spec) => (
                    <li
                      key={spec}
                      className="flex items-center gap-2.5 text-sm"
                      style={{ color: '#94a3b8' }}
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: '#7c3aed' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {spec}
                    </li>
                  ))}
                </ul>

                <Link
                  href={isAuthenticated ? "/dashboard" : "/dashboard"}
                  className="block w-full py-2.5 rounded-xl text-sm font-bold text-center transition-all hover:scale-105"
                  style={{
                    background: pkg.popular
                      ? 'linear-gradient(135deg, #7c3aed, #3b82f6)'
                      : 'transparent',
                    color: pkg.popular ? '#fff' : '#c084fc',
                    border: pkg.popular
                      ? 'none'
                      : '1px solid rgba(124,58,237,0.35)',
                    textDecoration: 'none',
                  }}
                >
                  {pkg.popular ? 'Get Started' : 'Choose Plan'}
                </Link>
              </div>
            )) : (
              // Fallback packages if database is empty
              [
                { id: 1, name: 'Starter', price: '5.00', cpu: 100, memory: 1024, disk: 5120, databases: 1, backups: 1 },
                { id: 2, name: 'Pro', price: '20.00', cpu: 200, memory: 4096, disk: 10240, databases: 5, backups: 3, popular: true, accent: '#7c3aed' },
                { id: 3, name: 'Enterprise', price: '50.00', cpu: 400, memory: 16384, disk: 204800, databases: 999, backups: 10 },
                { id: 4, name: 'Minecraft', price: '10.00', cpu: 150, memory: 2048, disk: 20480, databases: 2, backups: 2 },
              ].map((pkg) => (
                <div
                  key={pkg.id}
                  className="relative rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: pkg.popular ? '#1a1035' : '#0f1629',
                    border: `1px solid ${pkg.popular ? '#7c3aed' : '#1e2d4a'}`,
                    boxShadow: pkg.popular ? '0 0 30px rgba(124,58,237,0.2)' : 'none',
                  }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}
                      >
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <p className="font-bold text-base sm:text-lg mb-1" style={{ color: '#f0f4ff' }}>
                      {pkg.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="font-extrabold"
                        style={{
                          fontSize: 'clamp(1.8rem, 5vw, 2.25rem)',
                          color: pkg.popular ? '#c084fc' : '#f0f4ff',
                        }}
                      >
                        KSH {pkg.price}
                      </span>
                      <span className="text-xs" style={{ color: '#475569' }}>/mo</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {[fmtCpu(pkg.cpu), fmtRam(pkg.memory), fmtDisk(pkg.disk)].map((spec) => (
                      <li key={spec} className="flex items-center gap-2.5 text-sm" style={{ color: '#94a3b8' }}>
                        <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#7c3aed' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {spec}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/dashboard"}
                    className="block w-full py-2.5 rounded-xl text-sm font-bold text-center transition-all hover:scale-105"
                    style={{
                      background: pkg.popular ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'transparent',
                      color: pkg.popular ? '#fff' : '#c084fc',
                      border: pkg.popular ? 'none' : '1px solid rgba(124,58,237,0.35)',
                      textDecoration: 'none',
                    }}
                  >
                    {pkg.popular ? 'Get Started' : 'Choose Plan'}
                  </Link>
                </div>
              ))
            )}
          </div>

          <p className="text-center text-xs mt-8" style={{ color: '#374151' }}>
            🛡️ 2-week panel replacement warranty included on all plans
          </p>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section
        className="py-16 sm:py-20"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(10,10,15,1) 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="font-extrabold mb-4"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              color: '#f0f4ff',
            }}
          >
            Ready to get started?
          </h2>
          <p className="mb-8 text-sm sm:text-base" style={{ color: '#64748b' }}>
            Create your free account, top up your wallet, and deploy your first panel
            in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href={isAuthenticated ? "/dashboard" : "/dashboard"}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white text-base transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                boxShadow: '0 0 28px rgba(124,58,237,0.4)',
                textDecoration: 'none',
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              Go to Dashboard
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{
                color: '#94a3b8',
                border: '1px solid #1e2d4a',
                textDecoration: 'none',
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}