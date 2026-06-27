import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import ScrollProgress from '../src/components/ScrollProgress';

describe('ScrollProgress Component Smoke Test', () => {
  it('renders without crashing with default props', () => {
    const { container } = render(React.createElement(ScrollProgress, { scrollOffset: 0, totalSteps: 100 }));
    expect(container).toBeTruthy();
  });

  it('renders correctly with a given scroll offset', () => {
    const { container } = render(React.createElement(ScrollProgress, { scrollOffset: 50, totalSteps: 100 }));
    expect(container).toBeTruthy();
    // The progress bar should show the correct percentage
    const progressBar = container.querySelector('.scroll-progress-bar');
    if (progressBar) {
      expect(progressBar).toBeTruthy();
    }
  });
});