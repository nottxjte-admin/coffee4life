
import { Scroll } from '@react-three/drei'

export default function UI() {
  return (
    <>
      {/* Fixed UI Layer */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '2rem', display: 'flex', justifyContent: 'space-between', zIndex: 10, boxSizing: 'border-box', pointerEvents: 'none' }}>
        <h3 style={{ margin: 0, color: '#3b2818', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Coffee4life</h3>
        <nav style={{ pointerEvents: 'auto' }}>
          <a href="#" style={{ margin: '0 1rem', color: '#4a3018', textDecoration: 'none', fontWeight: 500 }}>Our Story</a>
          <a href="#" style={{ margin: '0 1rem', color: '#4a3018', textDecoration: 'none', fontWeight: 500 }}>Products</a>
          <button style={{ 
            background: '#3b2818', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1.5rem', 
            borderRadius: '20px',
            cursor: 'pointer',
            marginLeft: '1rem'
          }}>Buy Now</button>
        </nav>
      </div>

      {/* Scrollytelling HTML Layer */}
      <Scroll html style={{ width: '100vw', color: '#4a3018', fontFamily: 'sans-serif' }}>
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10vw' }}>
          <div>
            <h1 style={{ fontSize: '5rem', margin: 0, color: '#3b2818', letterSpacing: '-0.02em' }}>Savor the<br/>perfect blend.</h1>
            <p style={{ fontSize: '1.2rem', margin: '1.5rem 0', maxWidth: '400px', lineHeight: 1.6 }}>Discover the rich aromas and deep flavors of our ethically sourced coffee beans.</p>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '20px', height: '1px', background: '#4a3018' }}></span>
              Scroll down to explore
            </p>
          </div>
        </div>
        
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10vw' }}>
          <div style={{ textAlign: 'right', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>The Origin</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.8 }}>Sourced from the finest high-altitude farms. Every bean is handpicked for exceptional quality and character.</p>
          </div>
        </div>
        
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10vw' }}>
          <div style={{ maxWidth: '400px' }}>
            <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>The Process</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.8 }}>An artisanal approach. Precision roasting unlocks the complex aromas and deep flavors hidden within.</p>
          </div>
        </div>
        
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10vw' }}>
          <div style={{ textAlign: 'right', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>The Experience</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.8 }}>More than just a drink. A moment of tranquility, accompanied by the warmth and aroma that fills the room.</p>
          </div>
        </div>
        
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 10vw' }}>
          <div>
            <h2 style={{ fontSize: '4rem', margin: '0 0 1rem 0', color: '#3b2818' }}>Taste the Magic</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.8 }}>Ready for your daily ritual?</p>
            <button style={{ 
              background: '#3b2818', 
              color: 'white', 
              border: 'none', 
              padding: '1rem 3rem', 
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              borderRadius: '30px',
              cursor: 'pointer',
              transition: 'transform 0.2s, background 0.3s',
              boxShadow: '0 10px 20px rgba(59, 40, 24, 0.2)'
            }}>
              Shop Now
            </button>
          </div>
        </div>
      </Scroll>
    </>
  )
}
