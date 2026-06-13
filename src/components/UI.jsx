import { Scroll } from '@react-three/drei'

export default function UI() {
  return (
    <>
      {/* Fixed UI Layer */}
      <div className="fixed-nav">
        <h3 className="nav-logo">Coffee4life</h3>
        <nav className="nav-links">
          <a href="#">Our Story</a>
          <a href="#">Products</a>
          <button className="btn-buy">Buy Now</button>
        </nav>
      </div>

      {/* Scrollytelling HTML Layer */}
      <Scroll html className="scroll-container">
        <div className="section section-left">
          <div className="content-box">
            <h1 className="hero-title">Savor the<br/>perfect blend.</h1>
            <p className="hero-desc">Discover the rich aromas and deep flavors of our ethically sourced coffee beans.</p>
            <p className="scroll-indicator">
              <span className="scroll-line"></span>
              Scroll down to explore
            </p>
          </div>
        </div>
        
        <div className="section section-right">
          <div className="content-box">
            <h2 className="section-title">The Origin</h2>
            <p className="section-desc">Sourced from the finest high-altitude farms. Every bean is handpicked for exceptional quality and character.</p>
          </div>
        </div>
        
        <div className="section section-left">
          <div className="content-box">
            <h2 className="section-title">The Process</h2>
            <p className="section-desc">An artisanal approach. Precision roasting unlocks the complex aromas and deep flavors hidden within.</p>
          </div>
        </div>
        
        <div className="section section-right">
          <div className="content-box">
            <h2 className="section-title">The Experience</h2>
            <p className="section-desc">More than just a drink. A moment of tranquility, accompanied by the warmth and aroma that fills the room.</p>
          </div>
        </div>
        
        <div className="section section-center">
          <div className="content-box">
            <h2 className="hero-title">Taste the Magic</h2>
            <p className="section-desc mb-2">Ready for your daily ritual?</p>
            <button className="btn-shop">Shop Now</button>
          </div>
        </div>
      </Scroll>
    </>
  )
}
