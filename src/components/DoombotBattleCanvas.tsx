import React, { useEffect, useRef } from 'react';
import type { Question } from '../types/game';

interface DoombotBattleCanvasProps {
  currentQuestion?: Question;
  solvedCount: number;
  totalQuestions: number;
  lastBlastTrigger: number;
}

export const DoombotBattleCanvas: React.FC<DoombotBattleCanvasProps> = ({
  currentQuestion,
  solvedCount,
  totalQuestions,
  lastBlastTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
      size: number;
    }> = [];

    if (lastBlastTrigger > 0) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.5 ? '#00ff66' : '#00eefc',
          life: 1,
          size: Math.random() * 4 + 2,
        });
      }
    }

    let radarAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 15;

      ctx.save();

      // Concentric Radar Circles
      ctx.strokeStyle = 'rgba(0, 238, 252, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, radius * 0.65, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, radius * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.stroke();

      // Sweeping Radar Line
      radarAngle += 0.02;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, radarAngle, radarAngle + 0.4);
      ctx.fillStyle = 'rgba(0, 255, 102, 0.2)';
      ctx.fill();

      // Target Blip Dot
      const targetAngle = radarAngle - 0.2;
      const targetDist = radius * 0.6;
      const tx = centerX + Math.cos(targetAngle) * targetDist;
      const ty = centerY + Math.sin(targetAngle) * targetDist;

      ctx.fillStyle = '#00ff66';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff66';
      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, Math.PI * 2);
      ctx.fill();

      // Target Label
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00ff66';
      ctx.fillText(
        currentQuestion?.type === 'mcq'
          ? 'SCOUT DRONE ALPHA'
          : currentQuestion?.type === 'output'
          ? 'HEAVY MECHA BETA'
          : 'CYBER SENTINEL OMEGA',
        tx - 30,
        ty + 15
      );

      ctx.restore();

      // Render Laser Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      particles = particles.filter((p) => p.life > 0);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentQuestion, lastBlastTrigger]);

  return (
    <div className="w-full glass-card p-4 rounded-sm border border-[#00eefc]/30 flex flex-col items-center justify-center relative overflow-hidden font-mono">
      {/* Corner Brackets */}
      <div className="corner-bracket cb-tl" />
      <div className="corner-bracket cb-tr" />
      <div className="corner-bracket cb-bl" />
      <div className="corner-bracket cb-br" />

      <div className="w-full flex items-center justify-between text-xs text-[#00eefc] mb-2 border-b border-[#00eefc]/20 pb-2">
        <span className="font-bold tracking-wider font-mono">TACTICAL RADAR</span>
        <span className="text-[#00ff66] font-mono">
          CLEARED: {solvedCount}/{totalQuestions}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="w-full max-w-[300px] h-[200px] bg-[#0a0e17]/80 rounded-none border border-slate-800"
      />
    </div>
  );
};
