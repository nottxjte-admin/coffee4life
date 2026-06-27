import { Component } from 'react'
import FallbackUI from './FallbackUI'

/**
 * WebGLErrorBoundary — catches errors thrown during Canvas/WebGL initialization
 * or rendering, and shows a graceful non-3D fallback instead of a blank page.
 *
 * React Error Boundaries catch errors during rendering, in lifecycle methods,
 * and in constructors. They do NOT catch errors in:
 *   - Event handlers
 *   - Async code
 *   - SSR
 *   - The error boundary itself
 *
 * To cover async WebGL failures, we also register a global error handler
 * that surfaces uncaught errors into component state.
 */
export default class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log for diagnostics — only in development
    if (import.meta.env.DEV) {
      console.error('[WebGLErrorBoundary] Caught error:', error, errorInfo)
    }
  }

  componentDidMount() {
    // Listen for unhandled promise rejections that escape React's error boundaries.
    // The Three.js WebGL context creation failure throws with an empty error message
    // in some environments — we catch it by checking both the message and stack trace.
    this._unhandledRejection = (event) => {
      const reason = event.reason
      if (!reason) return

      const message = (reason.message || '').toLowerCase()
      const stack = (reason.stack || '').toLowerCase()
      const reasonStr = typeof reason === 'string' ? reason.toLowerCase() : ''

      const isWebGLError =
        message.includes('webgl') ||
        message.includes('three.') ||
        message.includes('r3f') ||
        stack.includes('webglrenderer') ||
        stack.includes('three') ||
        stack.includes('@react-three') ||
        reasonStr.includes('webgl') ||
        // Catch the case where the error message is empty but it came from
        // Three.js / R3F internals — the original investigation found empty
        // error messages from WebGL context creation failures.
        (message === '' && stack.length > 0)

      if (isWebGLError) {
        event.preventDefault()
        this.setState({
          hasError: true,
          error: reason instanceof Error ? reason : new Error(String(reason)),
        })
      }
    }
    window.addEventListener('unhandledrejection', this._unhandledRejection)
  }

  componentWillUnmount() {
    if (this._unhandledRejection) {
      window.removeEventListener('unhandledrejection', this._unhandledRejection)
    }
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />
    }

    return this.props.children
  }
}