import { useState } from 'react'
import { Scroll } from '@react-three/drei'
import { useScrollOffset } from '../scrollStore'

const NAV_LINKS = [
  { label: 'Our Story', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Blog', href: '#' },
]

const SECTIONS = [
  {
    id: 'hero',
    align: 'left',
    heading: null,
    heroTitle: 'Savor the\nperfect blend.',
    desc: 'Discover the rich aromas and deep flavors of our ethically sourced coffee beans.',
    extra: 'scroll-indicator',
  },
  {
    id: 'origin',
    align: 'right',
    heading: 'The Origin',
    desc: 'Sourced from the finest high-altitude farms. Every bean is handpicked for exceptional quality and character.',
    eyebrow: '01 — Origin',
  },
  {
    id: 'process',
    align: 'left',
    heading: 'The Process',
    desc: 'An artisanal approach. Precision roasting unlocks the complex aromas and deep flavors hidden within.',
    eyebrow: '02 — Process',
  },
  {
    id: 'experience',
    align: 'right',
    heading: 'The Experience',
    desc: 'More than just a drink. A moment of tranquility, accompanied by the warmth and aroma that fills the room.',
    eyebrow: '03 — Experience',
  },
  {
    id: 'cta',
    align: 'center',
    heading: 'Taste the Magic',
    desc: 'Ready for your daily ritual?',
    cta: true,
    eyebrow: 'Coffee4life',
  },
]

const SECTION_COUNT = SECTIONS.length

// How far into a section (0→1) before it starts animating in
const ENTER_THRESHOLD = 0.15
// How far before the end of the current section it starts fading out
const EXIT_THRESHOLD = 0.75

/**
 * Compute per-section animation state.
 * Each section occupies 1/SECTION_COUNT of the scroll range.
 * Returns: { visible: bool, phase: 'before'|'entering'|'active'|'exiting'|'after', t: 0→1 }
 */
function getSectionAnimation(sectionIdx, offset) {
  const sectionStart = sectionIdx / SECTION_COUNT
  const sectionEnd = (sectionIdx + 1) / SECTION_COUNT
  const sectionLen = sectionEnd - sectionStart

  // How far through this particular section we are (0→1)
  const localT = Math.max(0, Math.min(1, (offset - sectionStart) / sectionLen))

  const entering = localT < ENTER_THRESHOLD
  const active = localT >= ENTER_THRESHOLD && localT < EXIT_THRESHOLD

  let t // animation progress 0→1
  if (entering) {
    t = localT / ENTER_THRESHOLD
  } else if (active) {
    t = 1
  } else {
    t = 1 - (localT - EXIT_THRESHOLD) / (1 - EXIT_THRESHOLD)
  }

  const phase = entering ? 'entering' : active ? 'active' : 'exiting'

  return {
    localT,
    t: Math.max(0, Math.min(1, t)),
    phase,
    visible: offset >= sectionStart - 0.05 && offset < sectionEnd + 0.05,
  }
}

function Nav({ scrollOffset }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Nav becomes more opaque and gains a backdrop blur after Hero
  const navScrolled = scrollOffset > 0.12

  return (
    <header
      className={`fixed-nav${navScrolled ? ' fixed-nav--scrolled' : ''}`}
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

/**
 * Animated content box for each section.
 * Uses CSS custom properties to drive staggered child animations.
 */
function SectionContent({ section, sectionIdx, offset }) {
  const { t, phase } = getSectionAnimation(sectionIdx, offset)

  // Map t (0→1) to CSS transform+opacity values.
  // 'entering': slide up from below + fade in
  // 'exiting':  slide up slightly + fade out (parallax effect)
  const translateY = phase === 'entering'
    ? `${(1 - t) * 40}px`           // start 40px below, end at 0
    : phase === 'exiting'
    ? `${-(1 - t) * 20}px`          // subtle upward drift while exiting
    : '0px'

  const opacity = t.toFixed(4)

  const isSectionVisible = phase !== 'exiting' || t > 0.01

  return (
    <div
      className="content-box"
      style={{
        '--section-opacity': opacity,
        '--section-translateY': translateY,
        opacity: isSectionVisible ? undefined : 0,
        pointerEvents: t > 0.5 ? 'auto' : 'none',
      }}
    >
      {section.eyebrow && (
        <p
          className="section-eyebrow animate-child"
          style={{ '--child-delay': '0s' }}
        >
          {section.eyebrow}
        </p>
      )}

      {section.heroTitle ? (
        <h1
          className="hero-title animate-child"
          style={{ '--child-delay': '0.05s' }}
        >
          {section.heroTitle.split('\n').map((line, j) => (
            <span key={j}>
              {line}
              {j === 0 && <br />}
            </span>
          ))}
        </h1>
      ) : (
        <h2
          className="section-title animate-child"
          style={{ '--child-delay': '0.05s' }}
        >
          {section.heading}
        </h2>
      )}

      <p
        className={`section-desc animate-child${section.heroTitle ? ' hero-desc' : ''}`}
        style={{ '--child-delay': '0.12s' }}
      >
        {section.desc}
      </p>

      {section.extra === 'scroll-indicator' && (
        <p
          className="scroll-indicator animate-child"
          style={{ '--child-delay': '0.22s' }}
          aria-label="Scroll down to explore"
        >
          <span className="scroll-line" aria-hidden="true" />
          Scroll down to explore
        </p>
      )}

      {section.cta && (
        <button
          className="btn-shop animate-child"
          style={{ '--child-delay': '0.18s' }}
          aria-label="Shop our coffee collection"
        >
          Shop Now
        </button>
      )}
    </div>
  )
}

export default function UI() {
  const offset = useScrollOffset()

  return (
    <>
      <Nav scrollOffset={offset} />

      <Scroll html className="scroll-container" role="main">
        {SECTIONS.map((section, i) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className={`section section-${section.align}`}
            aria-label={section.heading || 'Hero'}
          >
            <SectionContent
              section={section}
              sectionIdx={i}
              offset={offset}
            />
          </section>
        ))}
      </Scroll>
    </>
  )
}
