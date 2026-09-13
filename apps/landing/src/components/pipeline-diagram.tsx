"use client";

import { type CSSProperties, useId, useState } from "react";

import { FINDINGS, PER_RUN, STEPS, type Step } from "@/lib/demo";

/**
 * The signature output of the product, drawn rather than screenshotted: the
 * six-step pipeline from `lib/demo`, with the three findings marked on it.
 *
 * The graph draws itself left to right, then the findings resolve on top of
 * it. It says nothing the legend beneath it does not also say in words, which
 * is why the whole frame can be replaced by that legend on a phone rather than
 * shipped as a 560px picture inside a 335px column.
 *
 * Every node carries its own numbers on hover or focus, so the graph rewards a
 * second look without the page having to explain itself twice.
 */

type Placed = Step & { col: number; cy: number };

const COL_X = [0, 150, 300, 450];
const NODE_W = 110;
const NODE_H = 48;
const VIEW_W = 560;
/** The drawable band of the viewBox: `viewBox="0 40 560 256"`. */
const VIEW_TOP = 40;

const LAYOUT: Record<number, { col: number; cy: number }> = {
  1: { col: 0, cy: 140 },
  2: { col: 1, cy: 76 },
  3: { col: 1, cy: 204 },
  4: { col: 2, cy: 76 },
  5: { col: 2, cy: 204 },
  6: { col: 3, cy: 140 },
};

const NODES: Placed[] = STEPS.map((step) => ({ ...step, ...LAYOUT[step.n] }));

const byStep = (n: number) => NODES.find((node) => node.n === n)!;
const rightOf = (node: Placed) => COL_X[node.col] + NODE_W;
const leftOf = (node: Placed) => COL_X[node.col];
const centreOf = (node: Placed) => COL_X[node.col] + NODE_W / 2;

/** Steps carrying an amber finding: the work to remove or downgrade. */
const FLAGGED = new Set(
  FINDINGS.filter((finding) => finding.tone === "amber").flatMap(
    (finding) => finding.steps,
  ),
);

/** Each edge draws in 0.7s, 0.12s apart, so the graph resolves by ~1.3s. */
const EDGES: Array<{ from: number; to: number; len: number }> = [
  { from: 1, to: 2, len: 82 },
  { from: 1, to: 3, len: 82 },
  { from: 2, to: 4, len: 40 },
  { from: 3, to: 5, len: 40 },
  { from: 4, to: 6, len: 82 },
  { from: 5, to: 6, len: 82 },
];

/**
 * The dependency the parallelism finding says is not real. It is marked in the
 * reveal group rather than drawn differently in the first place, because the
 * draw animation owns `stroke-dasharray` for the whole length of every edge:
 * a dashed edge would come out solid the moment the animation landed.
 */
const SOFT_EDGE = { from: 3, to: 5 };

function edgePath(from: Placed, to: Placed) {
  const x1 = rightOf(from);
  const x2 = leftOf(to);
  const mid = x1 + (x2 - x1) / 2;
  return `M ${x1} ${from.cy} C ${mid} ${from.cy}, ${mid} ${to.cy}, ${x2} ${to.cy}`;
}

const TIP_W = 132;
const TIP_H = 58;

const TIP_ROWS = (node: Placed): Array<[string, string]> => [
  ["model", node.model],
  ["avg tokens", node.tokens],
  ["cost/run", `$${node.cost.toFixed(4)}`],
];

function Tooltip({ node }: { node: Placed }) {
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
 * The same six steps as a list, for the width where the graph cannot be drawn
 * legibly. Not a fallback for the picture so much as the picture's own content,
 * set as type.
 */
function StepList() {
  return (
    <ol className="flex flex-col">
      {NODES.map((node) => (
        <li
          key={node.n}
          className="flex items-baseline justify-between gap-3 border-b border-line py-2 font-mono text-[0.78rem]"
        >
          <span className={FLAGGED.has(node.n) ? "text-amber" : "text-text"}>
            step {node.n} · {node.label}
          </span>
          <span className="shrink-0 text-muted">
            {node.model} · ${node.cost.toFixed(4)}
          </span>
        </li>
      ))}
      <li className="flex items-baseline justify-between gap-3 pt-2 font-mono text-[0.78rem] text-muted">
        <span>per run</span>
        <span className="text-text">${PER_RUN.toFixed(4)}</span>
      </li>
    </ol>
  );
}

/**
 * `idle` holds the graph at its end state without replaying the draw, so the
 * hero can mount it quietly and let the demo button start the show.
 */
export function PipelineDiagram({ idle = false }: { idle?: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const titleId = useId();

  const a = byStep(3);
  const b = byStep(6);
  const aCx = centreOf(a);
  const bCx = centreOf(b);

  return (
    <>
      {/* Below 640px the frame is narrower than the graph's smallest legible
          width, so the same six steps are set as type rather than scrolled
          sideways at seven pixels a glyph. */}
      <div className="sm:hidden">
        <StepList />
      </div>

      <svg
        viewBox="0 40 560 256"
        className="hidden h-auto w-full sm:block"
        role="group"
        aria-labelledby={titleId}
      >
        <title id={titleId}>
          A six-step LLM pipeline. Steps 3 and 6 both summarize and are flagged
          as the same work running twice. Step 4 is flagged as oversized. Step 5
          is drawn waiting on step 3, a dependency it does not use.
        </title>

        {EDGES.map((edge, i) => (
          <path
            key={`${edge.from}-${edge.to}`}
            d={edgePath(byStep(edge.from), byStep(edge.to))}
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
            key={`ground-${node.n}`}
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

        {/* The findings themselves, held back until the graph has drawn. */}
        <g
          className={idle ? undefined : "dag-reveal"}
          style={{ "--reveal-delay": "1.2s" } as CSSProperties}
        >
          {NODES.filter((node) => FLAGGED.has(node.n)).map((node) => (
            <rect
              key={node.n}
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

          {/* The removable dependency, laid over the edge it replaces. */}
          <path
            d={edgePath(byStep(SOFT_EDGE.from), byStep(SOFT_EDGE.to))}
            fill="none"
            stroke="var(--color-teal)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            strokeLinecap="round"
          />

          {/* The duplicate pair, tied together under the graph. What the tie
              means is spelled out in the legend below the frame, so no line of
              type has to survive being scaled down inside the picture. */}
          <path
            d={`M ${aCx} ${a.cy + NODE_H / 2} C ${aCx} ${a.cy + 118}, ${bCx} ${b.cy + 142}, ${bCx} ${b.cy + NODE_H / 2}`}
            fill="none"
            stroke="var(--color-amber)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
        </g>

        {NODES.map((node) => (
          <g
            key={node.n}
            tabIndex={0}
            aria-label={`Step ${node.n}, ${node.label}. Model ${node.model}, ${node.tokens} average tokens, $${node.cost.toFixed(4)} per run.`}
            className="dag-node"
            onMouseEnter={() => setActive(node.n)}
            onMouseLeave={() => setActive((n) => (n === node.n ? null : n))}
            onFocus={() => setActive(node.n)}
            onBlur={() => setActive((n) => (n === node.n ? null : n))}
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
              fill={
                FLAGGED.has(node.n) ? "var(--color-amber)" : "var(--color-text)"
              }
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
              step {node.n} · {node.model}
            </text>
          </g>
        ))}

        {active ? <Tooltip node={byStep(active)} /> : null}
      </svg>
    </>
  );
}
