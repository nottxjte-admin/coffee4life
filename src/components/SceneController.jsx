import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { CoffeeCup, CoffeeBean, Plant, Steam, Particles } from './Models'

const BEAN_COUNT = 20
const beansArr = Array.from({ length: BEAN_COUNT })

export default function SceneController() {
  const scroll = useScroll()

  const sceneGroup = useRef()
  const cupGroup = useRef()
  const beansGroup = useRef()
  const plantGroup = useRef()

  useFrame((state, delta) => {
    const offset = scroll.offset

    // ── Scroll ranges ────────────────────────────────────────────
    // Each range returns 0→1 over that slice of the scroll progress
    const rHeroOrigin       = scroll.range(0,    0.25) // 0%–25%
    const rOriginProcess    = scroll.range(0.25, 0.25) // 25%–50%
    const rProcessExperience = scroll.range(0.5, 0.25) // 50%–75%
    const rExperienceEnd    = scroll.range(0.75, 0.25) // 75%–100%

    // Curves that peak at the midpoint of each section
    const cOrigin      = scroll.curve(0.125, 0.25) // peaks ~12.5%
    const cProcess     = scroll.curve(0.375, 0.25) // peaks ~37.5%
    const cExperience  = scroll.curve(0.625, 0.25) // peaks ~62.5%

    // ── 1. Camera arc ────────────────────────────────────────────
    const angle  = offset * Math.PI * 2
    const radius = 5 + cOrigin * 2 - rExperienceEnd * 1.5
    const camY   = 2 + cProcess * 2 - rExperienceEnd * 0.5

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(angle) * radius, 0.05)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, Math.cos(angle) * radius, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, camY, 0.05)
    state.camera.lookAt(0, 0.5, 0)

    // ── 2. Cup: float + explode during Process ───────────────────
    if (cupGroup.current) {
      const targetY = rProcessExperience * 0.5 + rExperienceEnd * 0.2
      cupGroup.current.position.y = THREE.MathUtils.lerp(
        cupGroup.current.position.y, targetY, 0.05
      )

      // Explode: separate the 4 direct children of CoffeeCup's inner group.
      // CoffeeCup renders a <group> as its root, so children[0] of cupGroup
      // is that group, and its children are [body, handle, coffee, saucer].
      const cupRoot = cupGroup.current.children[0]
      if (cupRoot && cupRoot.children.length >= 4) {
        const explode = cProcess * 1.8
        const parts = cupRoot.children

        // 0 — body: slightly up
        parts[0].position.y = THREE.MathUtils.lerp(parts[0].position.y, 0.5 + explode * 0.5, 0.08)
        // 1 — handle: shift right and up
        parts[1].position.x = THREE.MathUtils.lerp(parts[1].position.x, 0.56 + explode * 0.4, 0.08)
        parts[1].position.y = THREE.MathUtils.lerp(parts[1].position.y, 0.5 + explode * 0.3, 0.08)
        // 2 — coffee surface: float up above body
        parts[2].position.y = THREE.MathUtils.lerp(parts[2].position.y, 0.93 + explode * 1.0, 0.08)
        // 3 — saucer: drop down
        parts[3].position.y = THREE.MathUtils.lerp(parts[3].position.y, 0.01 - explode * 0.6, 0.08)
      }
    }

    // ── 3. Beans: scatter during Origin + Process ────────────────
    if (beansGroup.current) {
      const scatter = rHeroOrigin * 3 + cOrigin * 2 + rOriginProcess * 2 - rExperienceEnd * 2

      beansGroup.current.children.forEach((bean, i) => {
        const angleBean = (i / BEAN_COUNT) * Math.PI * 2
        const dist = 0.3 + scatter * (0.4 + (i % 4) * 0.2)
        const floatY = scatter > 0
          ? Math.sin(state.clock.elapsedTime * 1.5 + i) * 0.18 * scatter
          : 0

        bean.position.x = THREE.MathUtils.lerp(bean.position.x, Math.cos(angleBean) * dist, 0.05)
        bean.position.z = THREE.MathUtils.lerp(bean.position.z, Math.sin(angleBean) * dist, 0.05)
        bean.position.y = THREE.MathUtils.lerp(bean.position.y, floatY + scatter * 0.18, 0.05)

        bean.rotation.x += delta * (0.1 + scatter * 0.45)
        bean.rotation.y += delta * (0.15 + scatter * 0.35)
      })
    }

    // ── 4. Plant: grow during Process → Experience ───────────────
    if (plantGroup.current) {
      const plantScale = THREE.MathUtils.clamp(
        0.1 + rOriginProcess * 0.35 + rProcessExperience * 0.55,
        0.1, 1.0
      )
      plantGroup.current.scale.setScalar(
        THREE.MathUtils.lerp(plantGroup.current.scale.x, plantScale, 0.05)
      )
      const targetX = -2 - cExperience * 0.8
      const targetZ = -2 - cExperience * 0.8
      plantGroup.current.position.x = THREE.MathUtils.lerp(plantGroup.current.position.x, targetX, 0.05)
      plantGroup.current.position.z = THREE.MathUtils.lerp(plantGroup.current.position.z, targetZ, 0.05)
    }

    // ── 5. Subtle overall turntable ──────────────────────────────
    if (sceneGroup.current) {
      sceneGroup.current.rotation.y = offset * Math.PI * 0.2
    }
  })

  return (
    <group ref={sceneGroup}>
      {/* Fog for depth / atmosphere */}
      <fog attach="fog" args={['#faf0e6', 10, 30]} />

      {/* Warm coffee-shop lighting */}
      <ambientLight intensity={0.45} color="#fff1e6" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.3}
        color="#ffe8d6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <spotLight
        position={[-5, 6, -4]}
        intensity={0.9}
        color="#e29578"
        penumbra={1}
        angle={0.4}
      />
      <pointLight position={[0, 2, 0]} intensity={0.6} color="#d4a373" />

      {/* Scene objects lifted slightly from the ground plane */}
      <group position={[0, -0.5, 0]}>

        {/* Coffee cup */}
        <group ref={cupGroup}>
          <CoffeeCup />
        </group>

        {/* Steam rising from the cup */}
        <Steam count={28} visible />

        {/* Coffee beans */}
        <group ref={beansGroup}>
          {beansArr.map((_, i) => (
            <CoffeeBean key={i} />
          ))}
        </group>

        {/* Plant (starts tiny, grows as user scrolls) */}
        <group ref={plantGroup} scale={0.1} position={[-2, 0, -2]}>
          <Plant />
        </group>

        {/* Ambient dust particles */}
        <Particles count={120} />

      </group>

      {/* Ground plane */}
      <mesh
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#faf0e6" roughness={1} />
      </mesh>
    </group>
  )
}
