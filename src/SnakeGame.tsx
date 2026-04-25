import { motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GameStatus, Point } from "./types";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_INCREMENT = 2;

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [status, setStatus] = useState<GameStatus>("IDLE");
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      if (!currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus("PLAYING");
    onScoreChange(0);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        setDirection((prev) => (prev.y === 0 ? { x: 0, y: -1 } : prev));
        break;
      case "ArrowDown":
        setDirection((prev) => (prev.y === 0 ? { x: 0, y: 1 } : prev));
        break;
      case "ArrowLeft":
        setDirection((prev) => (prev.x === 0 ? { x: -1, y: 0 } : prev));
        break;
      case "ArrowRight":
        setDirection((prev) => (prev.x === 0 ? { x: 1, y: 0 } : prev));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const update = useCallback(() => {
    if (status !== "PLAYING") return;

    setSnake((prev) => {
      const head = prev[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Collision with self
      if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        setStatus("GAME_OVER");
        return prev;
      }

      const newSnake = [newHead, ...prev];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        // Don't pop last element, snake grows
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, status, generateFood, onScoreChange]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear board
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = "rgba(0, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? "#00FFFF" : "rgba(0, 255, 255, 0.6)";
      
      // Neon glow effect for head
      if (isHead) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00FFFF";
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.roundRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2,
        4
      );
      ctx.fill();
    });

    // Draw food
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#FF00FF";
    ctx.fillStyle = "#FF00FF";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current > speed) {
        update();
        lastUpdateRef.current = timestamp;
      }
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [update, draw, speed]);

  return (
    <div className="relative flex flex-col items-center gap-6">
      <div className="relative p-2 rounded-xl glass-morphism overflow-hidden group shadow-[0_0_50px_rgba(0,255,255,0.1)]">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="rounded-lg shadow-inner"
        />
        
        {status === "IDLE" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <h2 className="text-4xl font-display font-bold mb-6 neon-glow-cyan text-neon-cyan">NEON SNAKE</h2>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-neon-cyan text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,255,0.5)]"
            >
              INITIALIZE
            </button>
          </div>
        )}

        {status === "PAUSED" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <h2 className="text-4xl font-display font-bold neon-glow-pink text-neon-pink">PAUSED</h2>
          </div>
        )}

        {status === "GAME_OVER" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
            <h2 className="text-4xl font-display font-bold mb-2 text-red-500">SYSTEM FAILURE</h2>
            <p className="text-xl font-mono mb-6 text-gray-400">SCORE: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 border-2 border-neon-pink text-neon-pink font-bold rounded-full hover:bg-neon-pink hover:text-black transition-all shadow-[0_0_20px_rgba(255,0,255,0.3)]"
            >
              RESTART
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-12 font-mono">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Score</span>
          <span className="text-3xl font-bold text-neon-cyan neon-glow-cyan">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Speed</span>
          <span className="text-3xl font-bold text-neon-pink neon-glow-pink">{(200 - speed).toString()}</span>
        </div>
      </div>
    </div>
  );
};
