"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useRef, Suspense, useState, Ref } from 'react'
import { Group, Box3, Vector3 } from 'three'
import { Mesh } from 'three'


const LoadingFallback = () => {
    const fallbackRef = useRef<Mesh>(null!)

    useFrame((state, delta) => {
        if (fallbackRef.current) {
            fallbackRef.current.rotation.x += 0.5 * delta
            fallbackRef.current.rotation.y += 0.5 * delta
        }
    })

    return (
        <mesh ref={fallbackRef}>
            <boxGeometry args={[1, 1, 1]} />
            {/* <circleGeometry args={[1, 1, 1]} /> */}
            <meshStandardMaterial color='gray' />
        </mesh>
    )
}
const STLViewer = () => {
    return (
        <Canvas
            shadows
            camera={{ position: [5, 5, 0], fov: 20 }}
            className='rounded-xl border-2 border-black'
        >
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                color='#0014dc'
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            <directionalLight
                position={[-5, -5, -5]}
                intensity={0.8}
                color='#ff8200'
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            <gridHelper args={[10, 10, '#444444', '#222222']} />
            <color attach='background' />
            <LoadingFallback />
            <OrbitControls />
        </Canvas>
    )
}

export default STLViewer
