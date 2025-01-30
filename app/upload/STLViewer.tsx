"use client"

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useRef, Suspense, useState, Ref, useEffect } from 'react'
import { Group, Box3, Vector3, BufferGeometry } from 'three'
import { Mesh } from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'


const LoadingFallback = () => {
	const fallbackRef = useRef<Mesh>(null!)

	useFrame((state, delta) => {
		if (fallbackRef.current) {
			fallbackRef.current.rotation.x += 0.5 * delta
			// fallbackRef.current.scale -= 0.2 * delta
			fallbackRef.current.rotation.y += 0.5 * delta
			// fallbackRef.current.scale += 0.2 * delta
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
interface STLViewerProps {
	fileUrl: string;
}

const Model = ({ fileUrl }: { fileUrl: string }) => {
	const [geometry, setGeometry] = useState<BufferGeometry>()
	useEffect(() => {
		const loader = new STLLoader()
		loader.load(fileUrl, geo => {
			setGeometry(geo)
		})
	}, [])
	const groupRef = useRef<Group>(null!);

	useFrame((state, delta) => {
		if (groupRef.current) {
			groupRef.current.rotation.y += 0.4 * delta;
			groupRef.current.rotation.x += 0.5 * delta;
		}
	});

	return (<mesh geometry={geometry} ref={groupRef}>
		<meshStandardMaterial color="#0014dc" />
	</mesh>)
};

const STLViewer = ({ fileUrl }: STLViewerProps) => {
	useEffect(() => {
		console.log(fileUrl, fileUrl.length)
	})
	return (
		<Canvas
			shadows
			camera={{ position: [15, 15, 0], fov: 30 }}
			className='rounded-xl border-2 border-black'
		>
			<ambientLight intensity={0.5} color="#ffffff" />
			<directionalLight
				position={[5, 5, 5]}
				intensity={1}
				color='#ffffff'
				castShadow
				shadow-mapSize-width={1024}
				shadow-mapSize-height={1024}
			/>
			<directionalLight
				position={[-5, -5, -5]}
				intensity={0.8}
				color='#ff8200'
				shadow-mapSize-width={1024}
				shadow-mapSize-height={1024}
			/>
			<color attach='background' />
			{fileUrl ?
				(
					<Suspense fallback={<LoadingFallback />}>
						<Model fileUrl={fileUrl} />
					</Suspense>
				) : (<LoadingFallback />)
			}
			<OrbitControls />
		</Canvas>
	)
}

export default STLViewer
