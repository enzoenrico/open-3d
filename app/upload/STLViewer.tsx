'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { Mesh } from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader' // Fixed import name

interface STLViewerProps {
  file: File
}

export default function STLViewer ({ file }: STLViewerProps) {
  const meshRef = useRef<Mesh>(null)

  useEffect(() => {
    if (file && meshRef.current) {
      const reader = new FileReader()
      const loader = new STLLoader() // Fixed typo (StlLoader → STLLoader)

      reader.onload = e => {
        const contents = e.target?.result
        if (contents) {
          const geometry = loader.parse(contents as ArrayBuffer)
          meshRef.current!.geometry = geometry
          geometry.center() // Center the geometry

          // Force update if needed
          meshRef.current!.geometry.verticesNeedUpdate = true
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }, [file])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.75
    }
  })

  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={meshRef}>
        <meshStandardMaterial color='gray' />
      </mesh>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  )
}
