import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import ScrollProgress from '../components/ScrollProgress'

// Mock scrollStore to control the offset value returned by useScrollOffset
const mockUseScrollOffset = vi.fn(() => 0)

vi.mock('../scrollStore', () => ({
  useScrollOffset: () => mockUseScrollOffset(),
  publishScroll: vi.fn(),
}))

describe('ScrollProgress', () => {
  beforeEach(() => {
    mockUseScrollOffset.mockReturnValue(0)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { container } = render(<ScrollProgress />)
    expect(container).toBeTruthy()
  })

  it('renders a progress bar with role="progressbar"', () => {
    render(<ScrollProgress />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('progress bar has correct aria attributes', () => {
    mockUseScrollOffset.mockReturnValue(0.42)
    render(<ScrollProgress />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '42')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    expect(progressBar).toHaveAttribute('aria-label', 'Page scroll progress')
  })

  it('progress bar fill width reflects the scroll offset', () => {
    mockUseScrollOffset.mockReturnValue(0.65)
    render(<ScrollProgress />)

    const fill = document.querySelector('.scroll-progress-fill')
    expect(fill).toBeInTheDocument()
    expect(fill).toHaveStyle({ width: '65.00%' })
  })

  it('renders 5 dot navigation buttons', () => {
    render(<ScrollProgress />)

    const dots = screen.getAllByRole('button')
    expect(dots).toHaveLength(5)
  })

  it('dot buttons have correct aria-labels for each section', () => {
    render(<ScrollProgress />)

    expect(screen.getByRole('button', { name: 'Go to section: Hero' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to section: Origin' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to section: Process' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to section: Experience' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to section: CTA' })).toBeInTheDocument()
  })

  it('highlights the correct active dot based on scroll offset', () => {
    // offset 0.25 → activeIdx = floor(0.25 * 5) = 1 → "Origin"
    mockUseScrollOffset.mockReturnValue(0.25)
    render(<ScrollProgress />)

    const dots = screen.getAllByRole('button')
    // First dot should NOT be active
    expect(dots[0]).not.toHaveClass('scroll-dot--active')
    // Second dot (Origin) should be active
    expect(dots[1]).toHaveClass('scroll-dot--active')
    // Others should NOT be active
    expect(dots[2]).not.toHaveClass('scroll-dot--active')
    expect(dots[3]).not.toHaveClass('scroll-dot--active')
    expect(dots[4]).not.toHaveClass('scroll-dot--active')

    // Active dot should have aria-current="true"
    expect(dots[1]).toHaveAttribute('aria-current', 'true')
    expect(dots[0]).not.toHaveAttribute('aria-current')
  })

  it('at offset 0 the first dot (Hero) is active', () => {
    mockUseScrollOffset.mockReturnValue(0)
    render(<ScrollProgress />)

    const dots = screen.getAllByRole('button')
    expect(dots[0]).toHaveClass('scroll-dot--active')
    expect(dots[0]).toHaveAttribute('aria-current', 'true')
  })

  it('at offset 1 the last dot (CTA) is active', () => {
    mockUseScrollOffset.mockReturnValue(1)
    render(<ScrollProgress />)

    const dots = screen.getAllByRole('button')
    expect(dots[4]).toHaveClass('scroll-dot--active')
    expect(dots[4]).toHaveAttribute('aria-current', 'true')
  })

  it('handles edge case: offset slightly below 1 correctly caps at last dot', () => {
    // floor(0.999 * 5) = floor(4.995) = 4 → last dot (CTA)
    mockUseScrollOffset.mockReturnValue(0.999)
    render(<ScrollProgress />)

    const dots = screen.getAllByRole('button')
    expect(dots[4]).toHaveClass('scroll-dot--active')
  })

  it('renders a side navigation landmark', () => {
    render(<ScrollProgress />)

    const nav = screen.getByRole('navigation', { name: 'Section navigation' })
    expect(nav).toBeInTheDocument()
  })

  it('progress bar width is 0% at offset 0', () => {
    mockUseScrollOffset.mockReturnValue(0)
    render(<ScrollProgress />)

    const fill = document.querySelector('.scroll-progress-fill')
    expect(fill).toHaveStyle({ width: '0.00%' })
  })

  it('progress bar width is 100% at offset 1', () => {
    mockUseScrollOffset.mockReturnValue(1)
    render(<ScrollProgress />)

    const fill = document.querySelector('.scroll-progress-fill')
    expect(fill).toHaveStyle({ width: '100.00%' })
  })
})