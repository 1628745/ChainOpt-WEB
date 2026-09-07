"use client";

import { type CSSProperties, useId, useState } from "react";

/**
 * The signature output of the product, drawn rather than screenshotted: a
 * chain of LLM calls in which two steps turn out to be the same work.
 *
 * This is the single orchestrated motion moment on the page. Edges draw
 * themselves left to right, the redundancy between step 3 and step 6 resolves
 * once they have landed, and the savings chip (owned by the hero) rises in
 * behind it.
 *
 * Every node carries its own numbers on hover or focus, so the graph rewards a
 * second look without the page having to explain itself twice.
 */

type Node = {
  id: string;
  step: number;
  label: string;
  model: string;
  tokens: string;
  cost: string;
  col: number;
  cy: number;
  flagged?: boolean;
};

const COL_X = [0, 150, 300, 450];
const NODE_W = 110;
const NODE_H = 48;
const VIEW_W = 560;

const NODES: Node[] = [
  {
    id: "route",
    step: 1,
    label: "route",
    model: "haiku",
    tokens: "410",
    cost: "$0.0004",
    col: 0,
    cy: 140,
  },
  {
    id: "extract",
    step: 2,
    label: "extract",
    model: "sonnet",
    tokens: "1,860",
    cost: "$0.0071",
    col: 1,
    cy: 76,
  },
  {
    id: "sum-a",
    step: 3,
    label: "summarise",
    model: "sonnet",
    tokens: "2,240",
    cost: "$0.0089",
    col: 1,
    cy: 204,
    flagged: true,
  },
  {
    id: "plan",
    step: 4,
    label: "plan",
    model: "opus",
    tokens: "1,120",
    cost: "$0.0210",
    col: 2,
    cy: 76,
  },
  {
    id: "retrieve",
    step: 5,
    label: "retrieve",
    model: "haiku",
    tokens: "690",
    cost: "$0.0007",
    col: 2,
    cy: 204,
  },
  {
    id: "sum-b",
    step: 6,
    label: "summarise",
    model: "sonnet",
    tokens: "2,180",
    cost: "$0.0086",
    col: 3,
    cy: 140,
    flagged: true,
  },
];

const byId = (id: string) => NODES.find((node) => node.id === id)!;
const rightOf = (node: Node) => COL_X[node.col] + NODE_W;
const leftOf = (node: Node) => COL_X[node.col];
const centreOf = (node: Node) => COL_X[node.col] + NODE_W / 2;

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
  const mid = x1 + (x2 - x1) / 2;
  return `M ${x1} ${from.cy} C ${mid} ${from.cy}, ${mid} ${to.cy}, ${x2} ${to.cy}`;
}

const TIP_W = 132;
const TIP_H = 58;

const TIP_ROWS = (node: Node): Array<[string, string]> => [
  ["model", node.model],
  ["avg tokens", node.tokens],
  ["cost/run", node.cost],
];

/** The drawable band of the viewBox: `viewBox="0 44 560 278"`. */
const VIEW_TOP = 44;

function Tooltip({ node }: { node: Node }) {
  // 8px clear of the node, clamped so it cannot run off either end of the
  // frame, and flipped below when the top row leaves no headroom above.
  const x = Math.min(
    Math.max(centreOf(node) - TIP_W / 2, 2),
    VIEW_W - TIP_W - 2,
  );
  const above = node.cy - NODE_H / 2 - 8 - TIP_H;
  const y = above >= VIEW_TOP + 2 ? above : node.cy + NODE_H / 2 + 8;

  return (
    <g className="dag-tip" pointerEvents="none">
      <rect
        x={x}
        y={y}
        width={TIP_W}
        height={TIP_H}
        rx="8"
        fill="var(--color-surface-2)"
        stroke="var(--color-line-strong)"
        strokeWidth="1"
      />
      {TIP_ROWS(node).map(([label, value], i) => (
        <g key={label}>
          <text
            x={x + 10}
            y={y + 18 + i * 15}
            fontSize="9.5"
            fontFamily="var(--font-mono)"
            fill="var(--color-muted)"
          >
            {label}
          </text>
          <text
            x={x + TIP_W - 10}
            y={y + 18 + i * 15}
            textAnchor="end"
            fontSize="9.5"
            fontFamily="var(--font-mono)"
            fill="var(--color-text)"
          >
            {value}
          </text>
        </g>
      ))}
    </g>
  );
}

/**
 * `idle` holds the graph at its end state without replaying the draw, so the
 * hero can mount it quietly and let the demo button start the show.
 */
export function PipelineDiagram({ idle = false }: { idle?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const titleId = useId();

  const a = byId("sum-a");
  const b = byId("sum-b");
  const aCx = centreOf(a);
  const bCx = centreOf(b);

  return (
    <svg
      viewBox="0 44 560 278"
      className="h-auto w-full min-w-[380px]"
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>
        A six-step LLM pipeline. Step 3 and step 6 both summarise and are
        flagged as the same work running twice, at 0.94 prompt similarity.
      </title>

      {EDGES.map((edge, i) => (
        <path
          key={`${edge.from}-${edge.to}`}
          d={edgePath(byId(edge.from), byId(edge.to))}
          fill="none"
          stroke="var(--color-line-strong)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={idle ? undefined : "dag-edge"}
          style={
            {
              "--edge-len": edge.len,
              "--edge-delay": `${i * 0.12}s`,
            } as CSSProperties
          }
        />
      ))}

      {/* Node grounds sit under the reveal, so the amber wash lands on top of
          them rather than being painted over. */}
      {NODES.map((node) => (
        <rect
          key={`ground-${node.id}`}
          x={COL_X[node.col]}
          y={node.cy - NODE_H / 2}
          width={NODE_W}
          height={NODE_H}
          rx="8"
          fill="var(--color-surface-2)"
          stroke="var(--color-line)"
          strokeWidth="1"
          pointerEvents="none"
        />
      ))}

      {/* The finding itself, held back until the graph has drawn. */}
      <g
        className={idle ? undefined : "dag-reveal"}
        style={{ "--reveal-delay": "1.2s" } as CSSProperties}
      >
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

      {NODES.map((node) => (
        <g
          key={node.id}
          tabIndex={0}
          role="button"
          aria-label={`Step ${node.step}, ${node.label}. Model ${node.model}, ${node.tokens} average tokens, ${node.cost} per run.`}
          className="dag-node"
          onMouseEnter={() => setActive(node.id)}
          onMouseLeave={() => setActive((id) => (id === node.id ? null : id))}
          onFocus={() => setActive(node.id)}
          onBlur={() => setActive((id) => (id === node.id ? null : id))}
        >
          {/* A transparent overlay on the node ground: it is the hit area
              (label text alone is a poor pointer target and an invisible one
              for the keyboard) and it carries the amber hover border. */}
          <rect
            x={COL_X[node.col]}
            y={node.cy - NODE_H / 2}
            width={NODE_W}
            height={NODE_H}
            rx="8"
            fill="transparent"
            strokeWidth="1.5"
            className="dag-node-box"
          />
          <text
            x={centreOf(node)}
            y={node.cy - 2}
            textAnchor="middle"
            fontSize="12"
            fontFamily="var(--font-mono)"
            fill={node.flagged ? "var(--color-amber)" : "var(--color-text)"}
          >
            {node.label}
          </text>
          <text
            x={centreOf(node)}
            y={node.cy + 14}
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-mono)"
            fill="var(--color-muted)"
          >
            step {node.step} · {node.model}
          </text>
        </g>
      ))}

      {active ? <Tooltip node={byId(active)} /> : null}
    </svg>
  );
}
