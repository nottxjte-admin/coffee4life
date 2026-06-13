import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

export function CoffeeCup({ ...props }) {
  const group = useRef()
  
  return (
    <group ref={group} {...props}>
      {/* Cup Body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.3, 1, 32, 1, false]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Cup Handle */}
      <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, -Math.PI / 16]} castShadow>
        <torusGeometry args={[0.25, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Coffee Inside */}
      <mesh position={[0, 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.47, 32]} />
        <meshStandardMaterial color="#3b2818" roughness={0.4} />
      </mesh>
      
      {/* Saucer */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.4, 0.1, 32]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  )
}

export function CoffeeBean({ ...props }) {
  const beanRef = useRef()

  return (
    <group ref={beanRef} {...props}>
      <mesh castShadow receiveShadow scale={[1, 1.5, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#4a3018" roughness={0.7} />
      </mesh>
      {/* The bean crack (simple indentation) */}
      <mesh position={[0, 0, 0.075]} scale={[0.1, 1.4, 0.1]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#2a1b0d" roughness={0.8} />
      </mesh>
    </group>
  )
}

export function Plant({ ...props }) {
  const group = useRef()
  
  // A simple stylized plant
  return (
    <group ref={group} {...props}>
      {/* Pot */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.6, 16]} />
        <meshStandardMaterial color="#d4a373" roughness={0.8} />
      </mesh>
      {/* Stem/Leaves */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#4a7c59" roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 0.7, 0.2]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#3a5a40" roughness={0.6} />
      </mesh>
      <mesh position={[-0.3, 0.8, -0.2]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#4a7c59" roughness={0.6} />
      </mesh>
    </group>
  )
}

// Particle system for ambient aroma/dust
export function Particles({ count = 100 }) {
  const pointsRef = useRef()
  
  // Create random positions inside useMemo to keep it pure
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
