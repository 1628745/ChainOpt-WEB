/**
 * The worked example the whole site is built on: one pipeline, its six steps,
 * and the three findings ChainOpt returns for it.
 *
 * Everything lives here because the same example is told three times -- the
 * graph in the hero, the CLI output beside it, the finding cards on the method
 * page -- and the three used to disagree with each other. Any figure a reader
 * could add up is derived below rather than typed twice.
 *
 * The numbers are illustrative, and every surface that shows them says so.
 */

export const PIPELINE = "support-triage";

/** Distinct call sites in the source; two of them resolve to the same step. */
export const CALL_SITES = 7;

/** Times the pipeline ran in the window the figures are drawn from. */
export const RUNS = 2000;

export type Step = {
  n: number;
  label: string;
  model: string;
  /** Average tokens per call, in and out. */
  tokens: string;
  /** Dollars per call. The six of these sum to `perRun`. */
  cost: number;
};

export const STEPS: Step[] = [
  { n: 1, label: "route", model: "haiku", tokens: "410", cost: 0.0002 },
  { n: 2, label: "extract", model: "sonnet", tokens: "3,340", cost: 0.0201 },
  { n: 3, label: "summarize", model: "sonnet", tokens: "3,220", cost: 0.0194 },
  { n: 4, label: "plan", model: "opus", tokens: "380", cost: 0.0113 },
  { n: 5, label: "retrieve", model: "haiku", tokens: "800", cost: 0.0004 },
  { n: 6, label: "summarize", model: "sonnet", tokens: "3,180", cost: 0.0191 },
];

const step = (n: number) => STEPS.find((s) => s.n === n)!;

/** $0.0705 across the six steps. */
export const PER_RUN = STEPS.reduce((total, s) => total + s.cost, 0);

/** $141.00 a month at 2,000 runs. */
export const MONTHLY = PER_RUN * RUNS;

/*
 * The two cost findings, priced from the steps above rather than asserted:
 *
 *   dropping step 6 saves its whole cost           $0.0191/run -> $38.20/mo
 *   step 4 on haiku instead of opus saves the gap  $0.0107/run -> $21.40/mo
 *
 * The third finding buys latency, not money, and is never added to a dollar
 * total anywhere on the site.
 */
const HAIKU_PLAN_COST = 0.0006;

export const REDUNDANCY_MONTHLY = step(6).cost * RUNS;
export const OVERSIZING_MONTHLY = (step(4).cost - HAIKU_PLAN_COST) * RUNS;
export const RECOVERABLE = REDUNDANCY_MONTHLY + OVERSIZING_MONTHLY;
export const OPTIMIZED = MONTHLY - RECOVERABLE;

/** Wall-clock the pipeline spends waiting on step 3 before step 5 can start. */
export const LATENCY_SAVED = "8.4s";

export type FindingId = "redundancy" | "oversizing" | "parallelism";

export type Finding = {
  id: FindingId;
  /** The word the CLI prints for this class of finding. */
  kind: string;
  /** Amber is waste to remove; teal is time given back. */
  tone: "amber" | "teal";
  /** Which steps it points at, for the graph. */
  steps: number[];
  /** One line, as the graph legend prints it. */
  where: string;
  /** The same location in the narrow form `chainopt findings` prints. */
  at: string;
  gain: string;
};

export const FINDINGS: Finding[] = [
  {
    id: "redundancy",
    kind: "redundancy",
    tone: "amber",
    steps: [3, 6],
    where: "steps 3 and 6",
    at: "steps 3, 6",
    gain: `+$${REDUNDANCY_MONTHLY.toFixed(2)}/mo`,
  },
  {
    id: "oversizing",
    kind: "oversizing",
    tone: "amber",
    steps: [4],
    where: "step 4, opus to haiku",
    at: "step 4",
    gain: `+$${OVERSIZING_MONTHLY.toFixed(2)}/mo`,
  },
  {
    id: "parallelism",
    kind: "parallelism",
    tone: "teal",
    steps: [3, 5],
    where: "step 5 waits on step 3",
    at: "step 5",
    gain: `-${LATENCY_SAVED}/run`,
  },
];

/** The three lines `chainopt findings` prints, one per finding. */
export const FINDINGS_OUTPUT = FINDINGS.map(
  (finding) => `${finding.kind.padEnd(13)}${finding.at.padEnd(12)}${finding.gain}`,
);

/** The two lines `chainopt analyze` prints, quoted verbatim by the hero. */
export const ANALYZE_OUTPUT = [
  `${CALL_SITES} call sites across ${STEPS.length} steps`,
  `${FINDINGS.length} findings · $${RECOVERABLE.toFixed(2)}/mo · ${LATENCY_SAVED}/run`,
];
