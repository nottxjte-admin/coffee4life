import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Our Story', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Blog', href: '#' },
]

const SECTIONS = [
  {
    id: 'hero',
    heroTitle: 'Savor the\nperfect blend.',
    desc: 'Ethically sourced from high-altitude farms.\nHand-roasted for depth, aroma, and ritual.',
    eyebrow: null,
  },
  {
    id: 'origin',
    heading: 'The Origin',
    desc: 'Sourced from the finest high-altitude farms across three continents. Every bean is handpicked for exceptional quality and singular character.',
    eyebrow: '01 — Origin',
  },
  {
    id: 'process',
    heading: 'The Process',
    desc: 'Precision roasting. An artisanal approach that unlocks the complex aromas and deep flavors hidden within each carefully selected bean.',
    eyebrow: '02 — Process',
  },
  {
    id: 'experience',
    heading: 'The Experience',
    desc: 'More than a drink — a moment of clarity. Accompanied by warmth, aroma, and the quiet ritual that defines your day.',
    eyebrow: '03 — Experience',
  },
  {
    id: 'cta',
    heading: 'Taste the Magic',
    desc: 'Your daily ritual, perfected.',
    cta: true,
    eyebrow: 'Coffee4life',
  },
]

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header
      className={`fixed-nav${scrolled ? ' fixed-nav--scrolled' : ''}`}
      role="banner"
    >
      <a href="/" className="nav-logo" aria-label="Coffee4life — home">
        Coffee4life
      </a>

      {/* Desktop nav */}
      <nav className="nav-links" aria-label="Main navigation">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={label} href={href}>
            {label}
          </a>
        ))}
        <button className="btn-buy" aria-label="Buy coffee now">
          Buy Now
        </button>
      </nav>

      {/* Mobile hamburger */}
      <button
        className="nav-hamburger"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
        <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
        <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="mobile-link"
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
          <div className="mobile-menu-divider" role="separator" />
          <button
            className="btn-buy btn-buy--mobile"
            onClick={closeMenu}
            aria-label="Buy coffee now"
          >
            Buy Now
          </button>
        </nav>
      )}
    </header>
  )
}

/**
 * FallbackUI — A graceful non-3D version of the landing page shown when
 * WebGL is unavailable or a rendering error occurs.
 *
 * Does NOT depend on @react-three/fiber, @react-three/drei, or three.js.
 * All sections are statically laid out in a single scrollable column.
 */
export default function FallbackUI() {
  return (
    <div className="fallback-page">
      <Nav />

      <main className="fallback-main" role="main">
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={`fallback-${section.id}`}
            className={`fallback-section${section.id === 'hero' ? ' fallback-hero' : ''}${section.id === 'cta' ? ' fallback-cta' : ''}`}
            aria-label={section.heading || 'Hero'}
          >
            <div className="fallback-content">
              {section.eyebrow && (
                <p className="section-eyebrow">{section.eyebrow}</p>
              )}

              {section.heroTitle ? (
                <h1 className="hero-title">
                  {section.heroTitle.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j === 0 && <br />}
                    </span>
                  ))}
                </h1>
              ) : (
                <h2 className="section-title">{section.heading}</h2>
              )}

              <p className={`section-desc${section.heroTitle ? ' hero-desc' : ''}`}>
                {section.desc.split('\n').map((line, j, arr) => (
                  <span key={j}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>

              {section.id === 'hero' && (
                <p
                  className="scroll-indicator"
                  aria-label="Scroll down to explore"
                >
                  <span className="scroll-line" aria-hidden="true" />
                  Scroll to explore
                </p>
              )}

              {section.cta && (
                <div className="cta-group">
                  <button
                    className="btn-shop"
                    aria-label="Shop our coffee collection"
                  >
                    Shop Now
                  </button>
                  <button
                    className="btn-learn"
                    aria-label="Learn more about our coffee"
                  >
                    Learn more
                  </button>
                </div>
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}