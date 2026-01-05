import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { GameState } from '../types';

// --- Game Constants ---
const PADDLE_WIDTH = 3;
const PADDLE_HEIGHT = 0.4;
const PADDLE_DEPTH = 0.4;
const BALL_RADIUS = 0.3;
const FIELD_WIDTH = 14;
const FIELD_DEPTH = 20;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 1.5;
const BRICK_HEIGHT = 0.5;
const BRICK_DEPTH = 0.5;
const BALL_SPEED = 18;
const PADDLE_Z = 8;

// --- Types ---
type BrickData = {
  id: number;
  position: [number, number, number];
  color: string;
  active: boolean;
  ref?: THREE.Mesh;
};

// --- Sub-Components ---

const GameContent: React.FC<{
  gameState: GameState;
  setGameState: (s: GameState) => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}> = ({ gameState, setGameState, setScore }) => {
  const { viewport, pointer } = useThree();
  
  // Refs for direct manipulation (Performance critical)
  const paddleRef = useRef<THREE.Mesh>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  // Mutable Game State (Refs instead of State to avoid re-renders during frame loop)
  const state = useRef({
    ballActive: false,
    ballAttached: true,
    ballVelocity: new THREE.Vector3(0, 0, 0),
    bricks: [] as BrickData[]
  });

  // Initialize Bricks
  useMemo(() => {
    const bricks: BrickData[] = [];
    const colors = ['#ff00ff', '#bd00ff', '#8a00ff', '#00f3ff', '#00ffa3'];
    
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        const x = (col - (BRICK_COLS - 1) / 2) * BRICK_WIDTH;
        const z = -8 + (row * BRICK_DEPTH * 2); 
        bricks.push({
          id: row * BRICK_COLS + col,
          position: [x, 0, z],
          color: colors[row % colors.length],
          active: true
        });
      }
    }
    state.current.bricks = bricks;
  }, []);

  // Reset Game
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      // Reset positions
      if (paddleRef.current) paddleRef.current.position.set(0, 0, PADDLE_Z);
      if (ballRef.current) ballRef.current.position.set(0, 0, PADDLE_Z - 1);
      
      // Reset State
      state.current.ballActive = false;
      state.current.ballAttached = true;
      state.current.ballVelocity.set(0, 0, 0);
      
      // Reactivate bricks
      state.current.bricks.forEach(b => {
        b.active = true;
        if (b.ref) b.ref.visible = true;
      });
      
      setScore(0);
    }
  }, [gameState]);

  // Handle Click to Launch
  useEffect(() => {
    const handleClick = () => {
      if (gameState === GameState.PLAYING && state.current.ballAttached) {
        state.current.ballAttached = false;
        state.current.ballActive = true;
        // Launch with random slight angle
        state.current.ballVelocity.set(
          (Math.random() - 0.5) * 8,
          0,
          -BALL_SPEED
        );
      }
    };
    window.addEventListener('pointerdown', handleClick);
    return () => window.removeEventListener('pointerdown', handleClick);
  }, [gameState]);

  // Main Game Loop (60 FPS)
  useFrame((_, delta) => {
    if (gameState !== GameState.PLAYING) return;

    // 1. Update Paddle Position based on mouse
    if (paddleRef.current) {
      // Convert normalized pointer (-1 to 1) to world units
      // We clamp it to the field width
      const targetX = (pointer.x * viewport.width) / 2;
      const limit = (FIELD_WIDTH - PADDLE_WIDTH) / 2;
      paddleRef.current.position.x = Math.max(-limit, Math.min(limit, targetX));
    }

    const paddle = paddleRef.current;
    const ball = ballRef.current;
    const light = lightRef.current;

    if (!ball || !paddle || !light) return;

    // 2. Ball Movement
    if (state.current.ballAttached) {
      // Stick to paddle
      ball.position.set(paddle.position.x, 0, PADDLE_Z - 0.8);
      light.position.copy(ball.position);
    } 
    else if (state.current.ballActive) {
      const velocity = state.current.ballVelocity;
      
      // Move ball
      ball.position.addScaledVector(velocity, delta);
      light.position.copy(ball.position);

      // --- Collisions ---

      // Walls (Left/Right)
      if (ball.position.x > FIELD_WIDTH / 2 - BALL_RADIUS) {
        ball.position.x = FIELD_WIDTH / 2 - BALL_RADIUS;
        velocity.x = -velocity.x;
      }
      if (ball.position.x < -FIELD_WIDTH / 2 + BALL_RADIUS) {
        ball.position.x = -FIELD_WIDTH / 2 + BALL_RADIUS;
        velocity.x = -velocity.x;
      }

      // Ceiling (Top)
      if (ball.position.z < -FIELD_DEPTH / 2) {
        ball.position.z = -FIELD_DEPTH / 2;
        velocity.z = -velocity.z;
      }

      // Paddle Collision
      if (
        ball.position.z > PADDLE_Z - PADDLE_DEPTH - BALL_RADIUS &&
        ball.position.z < PADDLE_Z + BALL_RADIUS &&
        Math.abs(ball.position.x - paddle.position.x) < PADDLE_WIDTH / 2 + BALL_RADIUS
      ) {
        // Only bounce if coming towards paddle
        if (velocity.z > 0) {
          velocity.z = -velocity.z;
          // Add English/Spin
          const hitPoint = ball.position.x - paddle.position.x;
          velocity.x = hitPoint * 5;
          // Speed up slightly
          velocity.multiplyScalar(1.02);
        }
      }

      // Floor (Game Over)
      if (ball.position.z > PADDLE_Z + 2) {
        setGameState(GameState.GAME_OVER);
        state.current.ballActive = false;
      }

      // Bricks
      let hit = false;
      for (const brick of state.current.bricks) {
        if (!brick.active) continue;

        // AABB Collision (Simple box overlap)
        const dx = Math.abs(ball.position.x - brick.position[0]);
        const dz = Math.abs(ball.position.z - brick.position[2]);

        if (dx < BRICK_WIDTH / 2 + BALL_RADIUS && dz < BRICK_DEPTH / 2 + BALL_RADIUS) {
          // Hit!
          brick.active = false;
          if (brick.ref) brick.ref.visible = false;
          
          // Determine bounce direction
          if (dx > dz) velocity.x = -velocity.x; // Hit side
          else velocity.z = -velocity.z; // Hit front/back

          setScore(s => s + 100);
          hit = true;
          break; // One collision per frame is safer
        }
      }
      
      // Win check
      if (hit) {
        if (state.current.bricks.every(b => !b.active)) {
             // Win -> Reset
             state.current.ballAttached = true;
             state.current.ballActive = false;
             // Reset bricks for endless play
             state.current.bricks.forEach(b => {
                 b.active = true;
                 if (b.ref) b.ref.visible = true;
             });
        }
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      
      {/* Paddle */}
      <mesh ref={paddleRef} position={[0, 0, PADDLE_Z]}>
        <boxGeometry args={[PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_DEPTH]} />
        <meshStandardMaterial 
          color="#00f3ff" 
          emissive="#00f3ff"
          emissiveIntensity={1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Ball */}
      <mesh ref={ballRef} position={[0, 0, PADDLE_Z - 1]}>
        <sphereGeometry args={[BALL_RADIUS, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Dynamic Light following ball */}
      <pointLight ref={lightRef} distance={8} intensity={2} color="#ffffff" />

      {/* Bricks */}
      {state.current.bricks.map((brick) => (
        <mesh 
          key={brick.id} 
          position={brick.position}
          ref={(el) => { if (el) brick.ref = el; }}
        >
          <boxGeometry args={[BRICK_WIDTH * 0.9, BRICK_HEIGHT, BRICK_DEPTH * 0.9]} />
          <meshStandardMaterial 
            color={brick.color}
            emissive={brick.color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Field Borders */}
      <mesh position={[-FIELD_WIDTH/2 - 0.2, 0, 0]}>
         <boxGeometry args={[0.4, 1, FIELD_DEPTH + 10]} />
         <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[FIELD_WIDTH/2 + 0.2, 0, 0]}>
         <boxGeometry args={[0.4, 1, FIELD_DEPTH + 10]} />
         <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 0, -FIELD_DEPTH/2 - 0.2]}>
         <boxGeometry args={[FIELD_WIDTH + 1, 1, 0.4]} />
         <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Floor Grid */}
      <gridHelper args={[FIELD_WIDTH, 20, 0x333333, 0x111111]} position={[0, -0.5, 0]} />
    </>
  );
};

const NeonGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);

  return (
    <div className="w-full max-w-4xl mx-auto h-[500px] relative rounded-xl overflow-hidden border-4 border-b-8 border-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.3)] bg-black select-none touch-none cursor-none">
      
      {/* HUD */}
      <div className="absolute top-4 left-4 z-10 font-['Press_Start_2P'] text-[#00f3ff] text-xs md:text-sm tracking-wider pointer-events-none drop-shadow-md">
        SCORE: {score.toString().padStart(5, '0')}
      </div>
      <div className="absolute top-4 right-4 z-10 font-['Press_Start_2P'] text-[#ff00ff] text-xs pointer-events-none animate-pulse">
        {gameState === GameState.PLAYING ? "SYSTEM: ACTIVE" : "SYSTEM: READY"}
      </div>

      {/* Overlays */}
      {gameState !== GameState.PLAYING && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm">
          <h3 className="text-4xl md:text-5xl font-['Press_Start_2P'] text-transparent bg-clip-text bg-gradient-to-b from-white to-[#00f3ff] mb-6 drop-shadow-[0_4px_0_#000]">
            NEON BREAKER
          </h3>
          {gameState === GameState.GAME_OVER && (
             <div className="mb-8 text-center animate-pulse">
               <p className="text-[#ff00ff] font-['Press_Start_2P'] text-lg">GAME OVER</p>
               <p className="text-gray-400 font-['Rajdhani'] mt-2">FINAL SCORE: {score}</p>
             </div>
          )}
          <button 
            onClick={() => setGameState(GameState.PLAYING)}
            className="group relative px-8 py-4 cursor-pointer"
          >
             <div className="absolute inset-0 border-2 border-[#00f3ff] group-hover:bg-[#00f3ff]/20 transition-all"></div>
             <span className="relative font-['Press_Start_2P'] text-white text-xs">
               {gameState === GameState.GAME_OVER ? "RETRY" : "START GAME"}
             </span>
          </button>
        </div>
      )}

      {gameState === GameState.PLAYING && (
        <div className="absolute bottom-10 w-full text-center z-10 pointer-events-none text-white/50 font-['Orbitron'] text-xs tracking-[0.3em]">
          CLICK TO LAUNCH • MOUSE TO MOVE
        </div>
      )}

      <Canvas camera={{ position: [0, 18, 12], fov: 45, rotation: [-1.0, 0, 0] }}>
        <color attach="background" args={['#050011']} />
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        <GameContent 
          gameState={gameState} 
          setGameState={setGameState} 
          setScore={setScore} 
        />
      </Canvas>
    </div>
  );
};

export default NeonGame;