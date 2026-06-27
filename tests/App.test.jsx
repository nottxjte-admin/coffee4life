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
  Nav: () => React.createElement('header', { 'data-testid': 'nav-mock' },
    React.createElement('a', { className: 'nav-logo' }, 'Coffee4life')
  ),
}));

vi.mock('../src/components/ScrollProgress', () => ({
  default: () => React.createElement('div', { 'data-testid': 'scroll-progress-mock' }),
}));

vi.mock('../src/scrollStore', () => ({
  useScrollOffset: () => 0.1,
  publishScroll: () => {},
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

  it('renders the navigation outside Canvas', () => {
    render(React.createElement(App));

    // Nav should be rendered (via ExternalNav + scrollStore)
    const navMock = screen.getByTestId('nav-mock');
    expect(navMock).toBeTruthy();

    // Nav logo should contain Coffee4life
    expect(screen.getByText('Coffee4life')).toBeTruthy();
  });

  it('renders without crashing', () => {
    const { container } = render(React.createElement(App));
    expect(container).toBeTruthy();
  });
});
