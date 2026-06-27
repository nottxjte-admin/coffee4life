import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../src/App';

// Mock Three.js / R3F modules that jsdom can't render
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => React.createElement('div', { 'data-testid': 'canvas-mock' }, children),
  useFrame: () => {},
  useThree: () => ({}),
}));

vi.mock('@react-three/drei', () => ({
  ScrollControls: ({ children }) => React.createElement('div', { 'data-testid': 'scroll-controls-mock' }, children),
  Scroll: ({ children }) => React.createElement('div', { 'data-testid': 'scroll-mock' }, children),
}));

vi.mock('../src/components/SceneController', () => ({
  default: () => React.createElement('div', { 'data-testid': 'scene-controller-mock' }),
}));

vi.mock('../src/components/UI', () => ({
  default: () => React.createElement('div', { 'data-testid': 'ui-mock' }, 'UI Content'),
}));

vi.mock('../src/components/ScrollProgress', () => ({
  default: () => React.createElement('div', { 'data-testid': 'scroll-progress-mock' }),
}));

describe('App Component Render Test', () => {
  it('renders the canvas container', async () => {
    const { container } = render(React.createElement(App));

    // The canvas container div should exist
    const canvasContainer = container.querySelector('#canvas-container');
    expect(canvasContainer).toBeTruthy();
  });

  it('renders the canvas with mocked Three.js components', () => {
    const { container } = render(React.createElement(App));

    // With mocks, Suspense resolves immediately so we see the mocked structure
    const canvasMock = container.querySelector('[data-testid="canvas-mock"]');
    expect(canvasMock).toBeTruthy();

    // The UI mock content should be visible
    expect(screen.getByText('UI Content')).toBeTruthy();
  });

  it('renders without crashing', () => {
    const { container } = render(React.createElement(App));
    expect(container).toBeTruthy();
  });
});