import type { CSSProperties } from "react";

/**
 * The product's signature output, drawn rather than screenshotted: a chain of
 * LLM calls in which two steps turn out to be the same work.
 *
 * This is the page's single orchestrated motion moment. Edges draw themselves
 * left to right, the redundancy between step 3 and step 6 resolves once they
 * have landed, and the savings chip (owned by the hero) rises in behind it.
 * Nothing else on the site animates on entry.
 */

type Node = {
  id: string;
  step: number;
  label: string;
  model: string;
  col: number;
  cy: number;
  flagged?: boolean;
};

const COL_X = [0, 150, 300, 450];
const NODE_W = 110;
const NODE_H = 48;

const NODES: Node[] = [
  { id: "route", step: 1, label: "route", model: "haiku", col: 0, cy: 140 },
  { id: "extract", step: 2, label: "extract", model: "sonnet", col: 1, cy: 76 },
  {
    id: "sum-a",
    step: 3,
    label: "summarise",
    model: "sonnet",
    col: 1,
    cy: 204,
    flagged: true,
  },
  { id: "plan", step: 4, label: "plan", model: "opus", col: 2, cy: 76 },
  { id: "retrieve", step: 5, label: "retrieve", model: "haiku", col: 2, cy: 204 },
  {
    id: "sum-b",
    step: 6,
    label: "summarise",
    model: "sonnet",
    col: 3,
    cy: 140,
    flagged: true,
  },
];

const byId = (id: string) => NODES.find((node) => node.id === id)!;
const rightOf = (node: Node) => COL_X[node.col] + NODE_W;
const leftOf = (node: Node) => COL_X[node.col];

/** Each edge draws in 0.7s, 0.12s apart, so the graph resolves by ~1.3s. */
const EDGES: Array<{ from: string; to: string; len: number }> = [
  { from: "route", to: "extract", len: 82 },
  { from: "route", to: "sum-a", len: 82 },
  { from: "extract", to: "plan", len: 40 },
  { from: "sum-a", to: "retrieve", len: 40 },
  { from: "plan", to: "sum-b", len: 82 },
  { from: "retrieve", to: "sum-b", len: 82 },
];

function edgePath(from: Node, to: Node) {
  const x1 = rightOf(from);
  const x2 = leftOf(to);
  const y1 = from.cy;
  const y2 = to.cy;
  const mid = x1 + (x2 - x1) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
}

export function PipelineDiagram() {
  const a = byId("sum-a");
  const b = byId("sum-b");
  const aCx = COL_X[a.col] + NODE_W / 2;
  const bCx = COL_X[b.col] + NODE_W / 2;

  return (
    <svg
      viewBox="0 44 560 278"
      className="h-auto w-full min-w-[380px]"
      role="img"
      aria-label="A six-step LLM pipeline. Step 3 and step 6 both summarise and are flagged as the same work running twice, at 0.94 prompt similarity."
    >
      {EDGES.map((edge, i) => (
        <path
          key={`${edge.from}-${edge.to}`}
          d={edgePath(byId(edge.from), byId(edge.to))}
          fill="none"
          stroke="var(--color-line-strong)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="dag-edge"
          style={
            {
              "--edge-len": edge.len,
              "--edge-delay": `${i * 0.12}s`,
            } as CSSProperties
          }
        />
      ))}

      {NODES.map((node) => (
        <rect
          key={node.id}
          x={COL_X[node.col]}
          y={node.cy - NODE_H / 2}
          width={NODE_W}
          height={NODE_H}
          rx="8"
          fill="var(--color-surface-2)"
          stroke="var(--color-line)"
          strokeWidth="1"
        />
      ))}

      {/* The finding itself, held back until the graph has drawn. */}
      <g className="dag-reveal" style={{ "--reveal-delay": "1.2s" } as CSSProperties}>
        {[a, b].map((node) => (
          <rect
            key={node.id}
            x={COL_X[node.col]}
            y={node.cy - NODE_H / 2}
            width={NODE_W}
            height={NODE_H}
            rx="8"
            fill="var(--color-amber-dim)"
            stroke="var(--color-amber)"
            strokeWidth="1.5"
          />
        ))}

        <path
          d={`M ${aCx} ${a.cy + NODE_H / 2} C ${aCx} ${a.cy + 118}, ${bCx} ${b.cy + 142}, ${bCx} ${b.cy + NODE_H / 2}`}
          fill="none"
          stroke="var(--color-amber)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        <text
          x={(aCx + bCx) / 2}
          y="310"
          textAnchor="middle"
          fontSize="12.5"
          fontFamily="var(--font-mono)"
          fill="var(--color-amber)"
        >
          same work, twice · 0.94 similarity
        </text>
      </g>

      {NODES.map((node) => {
        const cx = COL_X[node.col] + NODE_W / 2;
        return (
          <g key={node.id}>
            <text
              x={cx}
              y={node.cy - 2}
              textAnchor="middle"
              fontSize="12"
              fontFamily="var(--font-mono)"
              fill={node.flagged ? "var(--color-amber)" : "var(--color-text)"}
            >
              {node.label}
            </text>
            <text
              x={cx}
              y={node.cy + 14}
              textAnchor="middle"
              fontSize="10"
              fontFamily="var(--font-mono)"
              fill="var(--color-muted)"
            >
              step {node.step} · {node.model}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
