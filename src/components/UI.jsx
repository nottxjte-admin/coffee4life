import { useState } from 'react'
import { Scroll } from '@react-three/drei'

const NAV_LINKS = [
  { label: 'Our Story', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Blog', href: '#' },
]

const SECTIONS = [
  {
    align: 'left',
    heading: null,
    heroTitle: 'Savor the\nperfect blend.',
    desc: 'Discover the rich aromas and deep flavors of our ethically sourced coffee beans.',
    extra: 'scroll-indicator',
  },
  {
    align: 'right',
    heading: 'The Origin',
    desc: 'Sourced from the finest high-altitude farms. Every bean is handpicked for exceptional quality and character.',
  },
  {
    align: 'left',
    heading: 'The Process',
    desc: 'An artisanal approach. Precision roasting unlocks the complex aromas and deep flavors hidden within.',
  },
  {
    align: 'right',
    heading: 'The Experience',
    desc: 'More than just a drink. A moment of tranquility, accompanied by the warmth and aroma that fills the room.',
  },
  {
    align: 'center',
    heading: 'Taste the Magic',
    desc: 'Ready for your daily ritual?',
    cta: true,
  },
]

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed-nav" role="banner">
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
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <button
            className="btn-buy btn-buy--mobile"
            onClick={() => setMenuOpen(false)}
          >
            Buy Now
          </button>
        </nav>
      )}
    </header>
  )
}

export default function UI() {
  return (
    <>
      <Nav />

      <Scroll html className="scroll-container" role="main">
        {SECTIONS.map((section, i) => (
          <section
            key={i}
            className={`section section-${section.align}`}
            aria-label={section.heading || 'Hero'}
          >
            <div className="content-box">
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
                {section.desc}
              </p>

              {section.extra === 'scroll-indicator' && (
                <p className="scroll-indicator" aria-label="Scroll down to explore">
                  <span className="scroll-line" aria-hidden="true" />
                  Scroll down to explore
                </p>
              )}

              {section.cta && (
                <button className="btn-shop" aria-label="Shop our coffee collection">
                  Shop Now
                </button>
              )}
            </div>
          </section>
        ))}
      </Scroll>
    </>
  )
}
