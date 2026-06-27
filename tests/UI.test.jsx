import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

// Mock R3F modules before importing UI
vi.mock('@react-three/drei', () => ({
  Scroll: ({ children }) => React.createElement('div', null, children),
}));

vi.mock('../../scrollStore', () => ({
  useScrollOffset: () => 0,
}));

import UI from '../src/components/UI';

describe('UI Component Smoke Test', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(UI));
    expect(container).toBeTruthy();
  });

  it('renders the navigation header', () => {
    render(React.createElement(UI));
    // The nav logo "Coffee4life" link should exist
    const logoElements = document.querySelectorAll('.nav-logo');
    expect(logoElements.length).toBeGreaterThan(0);
    expect(logoElements[0].textContent).toContain('Coffee4life');
  });

  it('renders section elements', () => {
    const { container } = render(React.createElement(UI));
    const sections = container.querySelectorAll('.section');
    // Should have 5 sections (hero + origin + process + experience + cta)
    expect(sections.length).toBe(5);
  });
});