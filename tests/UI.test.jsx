import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

// Mock R3F modules before importing UI
vi.mock('@react-three/drei', () => ({
  Scroll: ({ children, ...props }) => React.createElement('div', props, children),
}));

vi.mock('../scrollStore', () => ({
  useScrollOffset: () => 0,
}));

import UI from '../src/components/UI';

describe('UI Component Smoke Test', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(UI));
    expect(container).toBeTruthy();
  });

  it('renders section elements', () => {
    const { container } = render(React.createElement(UI));
    const sections = container.querySelectorAll('.section');
    // Should have 5 sections (hero + origin + process + experience + cta)
    expect(sections.length).toBe(5);
  });

  it('renders scroll container with role main', () => {
    const { container } = render(React.createElement(UI));
    const scrollContainer = container.querySelector('[role="main"]');
    expect(scrollContainer).toBeTruthy();
  });
});
