import { useMemo } from 'react';
import { motion } from 'motion/react';

interface RadarDimension {
  label: string;
  current: number;
  target: number;
}

interface RadarChartProps {
  dimensions: RadarDimension[];
  size?: number;
  max?: number;
}

export default function RadarChart({
  dimensions,
  size = 300,
  max = 100,
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const padding = 44;
  const radius = size / 2 - padding;
  const levels = 4;
  const count = dimensions.length;

  const points = useMemo(() => {
    return dimensions.map((_, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      return { angle, cos: Math.cos(angle), sin: Math.sin(angle) };
    });
  }, [count, dimensions]);

  const toXY = (value: number, idx: number) => {
    const r = (value / max) * radius;
    const p = points[idx];
    return { x: cx + p.cos * r, y: cy + p.sin * r };
  };

  const makePath = (values: number[]) => {
    return (
      values
        .map((v, i) => {
          const { x, y } = toXY(v, i);
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(' ') + ' Z'
    );
  };

  const currentPath = makePath(dimensions.map((d) => d.current));
  const targetPath = makePath(dimensions.map((d) => d.target));

  return (
    <div className="w-full flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {Array.from({ length: levels }).map((_, lvl) => {
          const r = ((lvl + 1) / levels) * radius;
          const polygon = points
            .map((p) => `${(cx + p.cos * r).toFixed(2)},${(cy + p.sin * r).toFixed(2)}`)
            .join(' ');
          return (
            <polygon
              key={lvl}
              points={polygon}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={1}
              strokeDasharray={lvl === levels - 1 ? undefined : '3 3'}
            />
          );
        })}

        {points.map((p, i) => (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={cx + p.cos * radius}
            y2={cy + p.sin * radius}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        ))}

        <motion.path
          d={targetPath}
          fill="rgba(99,102,241,0.06)"
          stroke="#a5b4fc"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d={currentPath}
          fill="rgba(99,102,241,0.25)"
          stroke="#6366f1"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.85, transformOrigin: `${cx}px ${cy}px` }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {dimensions.map((d, i) => {
          const cur = toXY(d.current, i);
          const tar = toXY(d.target, i);
          const gap = d.target - d.current;
          return (
            <g key={`pt-${i}`}>
              <circle cx={tar.x} cy={tar.y} r={2.5} fill="#a5b4fc" />
              <circle
                cx={cur.x}
                cy={cur.y}
                r={gap > 15 ? 5 : 3.5}
                fill={gap > 15 ? '#f43f5e' : '#6366f1'}
                stroke="#fff"
                strokeWidth={1.5}
              />
            </g>
          );
        })}

        {dimensions.map((d, i) => {
          const p = points[i];
          const labelR = radius + 22;
          const x = cx + p.cos * labelR;
          const y = cy + p.sin * labelR;
          const anchor =
            Math.abs(p.cos) < 0.2 ? 'middle' : p.cos > 0 ? 'start' : 'end';
          const gap = d.target - d.current;
          return (
            <g key={`lb-${i}`}>
              <text
                x={x}
                y={y}
                textAnchor={anchor}
                dominantBaseline="middle"
                className="fill-slate-700"
                style={{ fontSize: 12, fontWeight: 700 }}
              >
                {d.label}
              </text>
              <text
                x={x}
                y={y + 14}
                textAnchor={anchor}
                dominantBaseline="middle"
                className={gap > 15 ? 'fill-rose-500' : gap > 0 ? 'fill-slate-400' : 'fill-emerald-500'}
                style={{ fontSize: 10, fontWeight: 600 }}
              >
                {d.current} / {d.target}
                {gap > 0 ? ` (−${gap})` : gap < 0 ? ` (+${-gap})` : ''}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex gap-4 mt-3 text-[13px] font-semibold text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-indigo-500/80" /> 当前能力
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-indigo-300 border-dashed" /> 目标要求（南大软工）
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> 重点差距
        </span>
      </div>
    </div>
  );
}
