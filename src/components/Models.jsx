import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Pre-create shared geometries and materials for performance
const cupBodyGeo = new THREE.CylinderGeometry(0.5, 0.3, 1, 32, 1, false)
const cupMaterial = new THREE.MeshStandardMaterial({ color: "#f5f5dc", roughness: 0.2, metalness: 0.1 })
const handleGeo = new THREE.TorusGeometry(0.25, 0.05, 16, 32, Math.PI)
const coffeeInsideGeo = new THREE.CircleGeometry(0.47, 32)
const coffeeInsideMat = new THREE.MeshStandardMaterial({ color: "#3b2818", roughness: 0.4 })
const saucerGeo = new THREE.CylinderGeometry(0.8, 0.4, 0.1, 32)

const beanGeo = new THREE.SphereGeometry(0.1, 16, 16)
const beanMat = new THREE.MeshStandardMaterial({ color: "#4a3018", roughness: 0.7 })
const beanCrackGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const beanCrackMat = new THREE.MeshStandardMaterial({ color: "#2a1b0d", roughness: 0.8 })

const potGeo = new THREE.CylinderGeometry(0.4, 0.3, 0.6, 16)
const potMat = new THREE.MeshStandardMaterial({ color: "#d4a373", roughness: 0.8 })
const leafSphereGeo = new THREE.SphereGeometry(0.5, 16, 16)
const leafSphereGeoSmall = new THREE.SphereGeometry(0.3, 16, 16)
const leafSphereGeoMed = new THREE.SphereGeometry(0.4, 16, 16)
const leafMatLight = new THREE.MeshStandardMaterial({ color: "#4a7c59", roughness: 0.6 })
const leafMatDark = new THREE.MeshStandardMaterial({ color: "#3a5a40", roughness: 0.6 })

export function CoffeeCup({ ...props }) {
  const group = useRef()
  
  return (
    <group ref={group} {...props}>
      <mesh geometry={cupBodyGeo} material={cupMaterial} position={[0, 0.5, 0]} castShadow receiveShadow />
      <mesh geometry={handleGeo} material={cupMaterial} position={[0.5, 0.5, 0]} rotation={[0, 0, -Math.PI / 16]} castShadow />
      <mesh geometry={coffeeInsideGeo} material={coffeeInsideMat} position={[0, 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={saucerGeo} material={cupMaterial} position={[0, 0, 0]} castShadow receiveShadow />
    </group>
  )
}

export function CoffeeBean({ ...props }) {
  const beanRef = useRef()

  return (
    <group ref={beanRef} {...props}>
      <mesh geometry={beanGeo} material={beanMat} castShadow receiveShadow scale={[1, 1.5, 0.8]} />
      <mesh geometry={beanCrackGeo} material={beanCrackMat} position={[0, 0, 0.075]} scale={[0.1, 1.4, 0.1]} />
    </group>
  )
}

export function Plant({ ...props }) {
  const group = useRef()
  
  return (
    <group ref={group} {...props}>
      <mesh geometry={potGeo} material={potMat} position={[0, 0.3, 0]} castShadow receiveShadow />
      <mesh geometry={leafSphereGeo} material={leafMatLight} position={[0, 0.9, 0]} castShadow />
      <mesh geometry={leafSphereGeoSmall} material={leafMatDark} position={[0.3, 0.7, 0.2]} castShadow />
      <mesh geometry={leafSphereGeoMed} material={leafMatLight} position={[-0.3, 0.8, -0.2]} castShadow />
    </group>
  )
}

export function Particles({ count = 100 }) {
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
      pointsRef.current.rotation.y = time * 0.05
      pointsRef.current.position.y = Math.sin(time * 0.5) * 0.2
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#d4a373" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}