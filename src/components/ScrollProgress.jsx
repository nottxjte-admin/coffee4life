/**
 * ScrollProgress — Fixed progress indicator outside Canvas.
 *
 * Renders:
 *  - A thin horizontal bar at the top that fills as the user scrolls.
 *  - Five dot-nav bullets (one per section) on the right edge.
 */

import { useScrollOffset } from '../scrollStore'

const SECTION_LABELS = ['Hero', 'Origin', 'Process', 'Experience', 'CTA']
const SECTION_COUNT = SECTION_LABELS.length

export default function ScrollProgress() {
  const offset = useScrollOffset()

  // Which section is active (0-indexed)
  const activeIdx = Math.min(
    Math.floor(offset * SECTION_COUNT),
    SECTION_COUNT - 1
  )

  // Progress bar fills from 0 to 100% of viewport width
  const barWidth = `${(offset * 100).toFixed(2)}%`

  return (
    <>
      {/* Top progress bar */}
      <div
        className="scroll-progress-bar"
        role="progressbar"
        aria-valuenow={Math.round(offset * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      >
        <div
          className="scroll-progress-fill"
          style={{ width: barWidth }}
        />
      </div>

      {/* Side dot navigation */}
      <nav
        className="scroll-dots"
        aria-label="Section navigation"
      >
        {SECTION_LABELS.map((label, i) => (
          <button
            key={label}
            className={`scroll-dot${i === activeIdx ? ' scroll-dot--active' : ''}`}
            aria-label={`Go to section: ${label}`}
            aria-current={i === activeIdx ? 'true' : undefined}
          />
        ))}
      </nav>
    </>
  )
}
