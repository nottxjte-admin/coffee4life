import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Shared Geometries & Materials ──────────────────────────────────────────
// Created once outside components — zero per-render allocation

// Coffee cup
const cupBodyGeo = new THREE.CylinderGeometry(0.5, 0.32, 1.0, 48, 1, false)
const cupBodyMat = new THREE.MeshStandardMaterial({
  color: '#f5f5dc',
  roughness: 0.25,
  metalness: 0.05,
})
// Handle: half torus rotated to sit on the right side
const handleGeo = new THREE.TorusGeometry(0.22, 0.055, 16, 48, Math.PI)
const handleMat = cupBodyMat // share material
// Coffee surface inside cup
const coffeeInsideGeo = new THREE.CircleGeometry(0.44, 48)
const coffeeInsideMat = new THREE.MeshStandardMaterial({
  color: '#3b2007',
  roughness: 0.5,
  metalness: 0.0,
})
// Saucer
const saucerGeo = new THREE.CylinderGeometry(0.85, 0.55, 0.12, 48)
const saucerMat = cupBodyMat

// Coffee bean
const beanGeo = new THREE.SphereGeometry(0.1, 20, 16)
const beanGeo2 = new THREE.BufferGeometry()
;(() => {
  // Flatten into coffee-bean shape: squash Y, elongate Z
  const pos = beanGeo.attributes.position.array.slice()
  for (let i = 0; i < pos.length; i += 3) {
    pos[i + 1] *= 0.65   // squash Y (thickness)
    pos[i + 2] *= 1.3    // elongate Z
  }
  beanGeo2.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  beanGeo2.setIndex(beanGeo.index)
  beanGeo2.setAttribute('normal', beanGeo.attributes.normal)
  beanGeo2.setAttribute('uv', beanGeo.attributes.uv)
})()
const beanMat = new THREE.MeshStandardMaterial({
  color: '#4a2e0e',
  roughness: 0.65,
  metalness: 0.0,
})
// Bean crease line
const creaseCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.035, -0.12),
  new THREE.Vector3(0, 0.035, 0),
  new THREE.Vector3(0, 0.035, 0.12),
])
const creaseGeo = new THREE.TubeGeometry(creaseCurve, 12, 0.012, 6, false)
const creaseMat = new THREE.MeshStandardMaterial({ color: '#2a1605', roughness: 0.9 })

// Terracotta pot
const potGeo = new THREE.CylinderGeometry(0.42, 0.3, 0.65, 32)
const potRimGeo = new THREE.TorusGeometry(0.42, 0.04, 12, 48)
const potMat = new THREE.MeshStandardMaterial({
  color: '#c47a3a',
  roughness: 0.85,
  metalness: 0.0,
})
const potRimMat = new THREE.MeshStandardMaterial({
  color: '#b06828',
  roughness: 0.9,
})
// Soil disc
const soilGeo = new THREE.CircleGeometry(0.38, 32)
const soilMat = new THREE.MeshStandardMaterial({ color: '#3d2b1a', roughness: 1 })
// Plant leaf cluster spheres
const leafBigGeo = new THREE.SphereGeometry(0.55, 20, 16)
const leafMidGeo = new THREE.SphereGeometry(0.38, 20, 16)
const leafSmallGeo = new THREE.SphereGeometry(0.28, 20, 16)
const leafMatLight = new THREE.MeshStandardMaterial({ color: '#4e7c55', roughness: 0.7, metalness: 0.0 })
const leafMatDark = new THREE.MeshStandardMaterial({ color: '#315c38', roughness: 0.7, metalness: 0.0 })

// ─── CoffeeCup ───────────────────────────────────────────────────────────────
/**
 * Composed of exactly 4 mesh children (in order):
 *   0 — body
 *   1 — handle
 *   2 — coffee surface (inside)
 *   3 — saucer
 * SceneController's explode logic relies on this order.
 */
export function CoffeeCup(props) {
  const group = useRef()

  return (
    <group ref={group} {...props}>
      {/* 0 — body */}
      <mesh
        geometry={cupBodyGeo}
        material={cupBodyMat}
        position={[0, 0.5, 0]}
        castShadow
        receiveShadow
      />
      {/* 1 — handle: half-torus rotated so the opening faces the cup */}
      <mesh
        geometry={handleGeo}
        material={handleMat}
        position={[0.56, 0.5, 0]}
        rotation={[0, Math.PI / 2, Math.PI / 2]}
        castShadow
      />
      {/* 2 — coffee surface */}
      <mesh
        geometry={coffeeInsideGeo}
        material={coffeeInsideMat}
        position={[0, 0.93, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {/* 3 — saucer */}
      <mesh
        geometry={saucerGeo}
        material={saucerMat}
        position={[0, 0.01, 0]}
        castShadow
        receiveShadow
      />
    </group>
  )
}

// ─── CoffeeBean ──────────────────────────────────────────────────────────────
export function CoffeeBean(props) {
  const beanRef = useRef()

  return (
    <group ref={beanRef} {...props}>
      <mesh geometry={beanGeo2} material={beanMat} castShadow receiveShadow />
      <mesh geometry={creaseGeo} material={creaseMat} />
    </group>
  )
}

// ─── Plant ───────────────────────────────────────────────────────────────────
export function Plant(props) {
  const group = useRef()

  return (
    <group ref={group} {...props}>
      {/* Pot */}
      <mesh geometry={potGeo} material={potMat} position={[0, 0.325, 0]} castShadow receiveShadow />
      <mesh geometry={potRimGeo} material={potRimMat} position={[0, 0.65, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={soilGeo} material={soilMat} position={[0, 0.63, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      {/* Foliage clusters */}
      <mesh geometry={leafBigGeo} material={leafMatLight} position={[0, 1.1, 0]} castShadow />
      <mesh geometry={leafMidGeo} material={leafMatDark} position={[0.35, 0.88, 0.2]} castShadow />
      <mesh geometry={leafMidGeo} material={leafMatLight} position={[-0.3, 0.95, -0.25]} castShadow />
      <mesh geometry={leafSmallGeo} material={leafMatDark} position={[0.15, 1.28, 0.1]} castShadow />
      <mesh geometry={leafSmallGeo} material={leafMatLight} position={[-0.2, 1.22, -0.1]} castShadow />
    </group>
  )
}

// ─── Steam ───────────────────────────────────────────────────────────────────
// Animated wisps above the cup using point sprites
export function Steam({ count = 30, visible = true }) {
  const ref = useRef()

   
  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // eslint-disable-next-line react-hooks/purity
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.3
      // eslint-disable-next-line react-hooks/purity
      positions[i * 3 + 1] = 1.0 + Math.random() * 0.5
      // eslint-disable-next-line react-hooks/purity
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3
      // eslint-disable-next-line react-hooks/purity
      speeds[i] = 0.3 + Math.random() * 0.4
      // eslint-disable-next-line react-hooks/purity
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, speeds, phases }
  }, [count])

  useFrame((state) => {
    if (!ref.current || !visible) return
    const t = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const base = i * 3
      // Rise upward, looping back after 1.5 units
      const rise = ((t * speeds[i] + phases[i]) % 1.5)
      pos[base + 1] = 1.0 + rise
      // Gentle lateral drift
      pos[base + 0] = Math.sin(t * 0.5 + phases[i]) * 0.15
      pos[base + 2] = Math.cos(t * 0.4 + phases[i]) * 0.15
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    // Fade opacity as steam rises
    ref.current.material.opacity = visible ? 0.28 : 0
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.28}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// ─── Ambient Particles ───────────────────────────────────────────────────────
// Floating dust / spore particles for atmosphere
export function Particles({ count = 120 }) {
  const pointsRef = useRef()

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      // eslint-disable-next-line react-hooks/purity
      pos[i] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.04
      pointsRef.current.position.y = Math.sin(time * 0.35) * 0.15
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#d4a373"
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
