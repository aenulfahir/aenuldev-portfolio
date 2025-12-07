import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { Home, ArrowLeft, Rocket } from "lucide-react";

// Star Field Component - Warp Speed Effect
function StarField() {
  const ref = useRef<THREE.Points>(null);
  const count = 3000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.02;
      ref.current.rotation.y -= delta * 0.03;

      // Warp speed effect - move stars towards camera
      const positions = ref.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 2] += delta * 2;
        if (positions[i * 3 + 2] > 25) {
          positions[i * 3 + 2] = -25;
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00ff9d"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Secondary Star Field - Different color
function StarFieldSecondary() {
  const ref = useRef<THREE.Points>(null);
  const count = 1500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.01;
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00b8ff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Floating Astronaut/Satellite Object
function FloatingObject({
  mouse,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta;
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(time.current * 0.5) * 0.3;
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x = Math.sin(time.current * 0.3) * 0.1;

      // Mouse parallax
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        mouse.current.x * 0.5,
        0.05
      );
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        mouse.current.y * 0.3,
        0.05
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef}>
        {/* Main body - Satellite/Spacecraft */}
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.9}
            roughness={0.1}
            emissive="#00ff9d"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Solar panels */}
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.2, 0.05, 0.6]} />
          <meshStandardMaterial
            color="#00b8ff"
            metalness={0.8}
            roughness={0.2}
            emissive="#00b8ff"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[1.2, 0.05, 0.6]} />
          <meshStandardMaterial
            color="#00b8ff"
            metalness={0.8}
            roughness={0.2}
            emissive="#00b8ff"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Broken parts floating */}
        <mesh position={[0.5, -0.8, 0.3]} rotation={[0.5, 0.3, 0.2]}>
          <tetrahedronGeometry args={[0.15]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.6, -0.6, -0.2]} rotation={[0.2, 0.5, 0.1]}>
          <tetrahedronGeometry args={[0.1]} />
          <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

// Camera Controller with Mouse Parallax
function CameraController({
  mouse,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.current.x * 0.5,
      0.02
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mouse.current.y * 0.3,
      0.02
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// 3D Scene
function Scene({
  mouse,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <>
      <color attach="background" args={["#000008"]} />
      <fog attach="fog" args={["#000008", 5, 30]} />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ff9d" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00b8ff" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#ffffff"
      />

      <StarField />
      <StarFieldSecondary />
      <FloatingObject mouse={mouse} />
      <CameraController mouse={mouse} />
    </>
  );
}

// Glitch Text Component
const GlitchText: React.FC<{ children: string }> = ({ children }) => {
  return (
    <div className="glitch-wrapper">
      <div className="glitch" data-text={children}>
        {children}
      </div>
    </div>
  );
};

// Main 404 Page Component
const NotFound: React.FC = () => {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#000008",
      }}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ position: "absolute", top: 0, left: 0 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>

      {/* Overlay Content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {/* Glitch 404 Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ marginBottom: "-2rem" }}
        >
          <GlitchText>404</GlitchText>
        </motion.div>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            color: "var(--text-secondary)",
            marginBottom: "1rem",
            textAlign: "center",
            fontWeight: 300,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Lost in Space
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            color: "var(--text-secondary)",
            marginBottom: "2.5rem",
            textAlign: "center",
            maxWidth: "500px",
            padding: "0 1rem",
            lineHeight: 1.6,
          }}
        >
          The page you're looking for has drifted into the cosmic void.
          <br />
          Let's navigate you back to safety.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          <Link
            to="/"
            className="btn-404-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              background:
                "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
              color: "#000",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 0 30px rgba(0, 255, 157, 0.3)",
            }}
          >
            <Home size={20} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn-404-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              color: "var(--text-primary)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "all 0.3s ease",
            }}
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{
            position: "absolute",
            bottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--text-secondary)",
            fontSize: "0.85rem",
          }}
        >
          <Rocket size={16} color="var(--primary-color)" />
          <span>Error Code: SPACE_ANOMALY_404</span>
        </motion.div>
      </div>

      {/* Styles */}
      <style>{`
        .glitch-wrapper {
          position: relative;
        }

        .glitch {
          font-size: clamp(8rem, 20vw, 15rem);
          font-weight: 900;
          color: transparent;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          background-clip: text;
          position: relative;
          text-shadow: 0 0 80px rgba(0, 255, 157, 0.5);
          animation: glitch 2s infinite;
        }

        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          background-clip: text;
        }

        .glitch::before {
          animation: glitch-1 0.3s infinite linear alternate-reverse;
          clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
        }

        .glitch::after {
          animation: glitch-2 0.3s infinite linear alternate-reverse;
          clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
        }

        @keyframes glitch {
          0%, 100% { text-shadow: 0 0 80px rgba(0, 255, 157, 0.5); }
          25% { text-shadow: -2px 0 rgba(0, 184, 255, 0.8), 2px 0 rgba(255, 0, 157, 0.8); }
          50% { text-shadow: 0 0 80px rgba(0, 255, 157, 0.5); }
          75% { text-shadow: 2px 0 rgba(0, 184, 255, 0.8), -2px 0 rgba(255, 0, 157, 0.8); }
        }

        @keyframes glitch-1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-5px); }
        }

        @keyframes glitch-2 {
          0% { transform: translateX(0); }
          100% { transform: translateX(5px); }
        }

        .btn-404-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 50px rgba(0, 255, 157, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .btn-404-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--primary-color);
          transform: translateY(-3px);
          box-shadow: 0 0 30px rgba(0, 255, 157, 0.2);
        }

        @media (max-width: 768px) {
          .glitch {
            font-size: clamp(5rem, 25vw, 10rem);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
