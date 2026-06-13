import { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/futuristic.css';

/* ─── Futuristic Design tokens ───────────────────────────────────── */
const GLASS_BG     = 'var(--ft-glass-bg)';
const GLASS_BORDER = 'var(--ft-glass-border)';
const TEXT_PRIMARY = 'var(--ft-text-primary)';
const TEXT_MUTED   = 'var(--ft-text-secondary)';
const BG_DARK      = 'var(--ft-bg-tertiary)';

/* ─── Node rank → neon accent colour ─────────────────────────────── */
const RANK_COLORS = ['#00d4ff', '#8b5cf6', '#ff006e', '#00ff88', '#f59e0b'];

/* ─── Extract 2-3 short trait phrases from the reason string ─────── */
function extractTraits(reason = '', max = 3) {
  if (!reason) return [];
  // Split on ". " or "; " or "— " to get clauses
  const clauses = reason
    .split(/[.;—]+/)
    .map(s => s.trim())
    .filter(s => s.length > 6 && s.length < 60);

  // Take up to `max` short clauses as trait labels
  return clauses.slice(0, max);
}

/* ─── Layout constants ───────────────────────────────────────────── */
const CX = 0;       // center x
const CY = 0;       // center y
const CAREER_X    = 380;  // x of career nodes
const TRAIT_X     = 740;  // x of trait sub-nodes
const ROW_HEIGHT  = 170;  // vertical gap between career rows

/* ─── Build nodes + edges from recommendations array ─────────────── */
function buildGraph(recs) {
  const nodes = [];
  const edges = [];

  // ── Central "Profile" node ── glowing orb style ────────────────
  nodes.push({
    id: 'center',
    type: 'default',
    position: { x: CX, y: CY + (recs.length - 1) * ROW_HEIGHT * 0.5 },
    data: { label: 'Your\nProfile' },
    style: {
      background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
      color: '#fff',
      border: 'none',
      borderRadius: 20,
      fontWeight: 800,
      fontSize: 14,
      width: 120,
      height: 68,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      whiteSpace: 'pre-line',
      boxShadow: '0 0 30px rgba(0,212,255,0.4), 0 0 60px rgba(139,92,246,0.2), 0 8px 32px rgba(0,0,0,0.3)',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
  });

  recs.forEach((career, ci) => {
    const color    = RANK_COLORS[ci] || '#00d4ff';
    const careerY  = ci * ROW_HEIGHT;
    const careerId = `career-${ci}`;

    // ── Career node ── glassmorphism card with neon border ────────
    nodes.push({
      id: careerId,
      type: 'default',
      position: { x: CAREER_X, y: careerY },
      data: {
        label: (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: color,
              color: '#fff',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 800,
              padding: '2px 8px',
              marginBottom: 5,
              display: 'inline-block',
              boxShadow: `0 0 10px ${color}40`,
              letterSpacing: '0.03em',
            }}>
              #{career.rank}
            </div>
            <div style={{ fontWeight: 800, color: TEXT_PRIMARY, fontSize: 13, lineHeight: 1.3 }}>
              {career.title}
            </div>
            {career.salary && (
              <div style={{ fontSize: 11, color: '#00ff88', fontWeight: 700, marginTop: 4, textShadow: '0 0 8px rgba(0,255,136,0.3)' }}>
                {career.salary}
              </div>
            )}
          </div>
        ),
      },
      style: {
        background: 'var(--ft-bg-secondary)',
        border: `1.5px solid ${color}40`,
        borderRadius: 14,
        padding: '12px 16px',
        width: 190,
        boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${color}15`,
      },
    });

    // ── Edge: center → career ── animated glowing line ───────────
    edges.push({
      id: `e-center-${careerId}`,
      source: 'center',
      target: careerId,
      animated: true,
      style: { stroke: color, strokeWidth: 2, opacity: 0.7 },
    });

    // ── Trait sub-nodes ── small glassmorphism chips ─────────────
    const traits = extractTraits(career.reason, 2);
    traits.forEach((trait, ti) => {
      const traitId = `trait-${ci}-${ti}`;
      const traitY  = careerY + (ti - (traits.length - 1) / 2) * 60;

      nodes.push({
        id: traitId,
        type: 'default',
        position: { x: TRAIT_X, y: traitY },
        data: { label: trait },
        style: {
          background: 'var(--ft-bg-tertiary)',
          color: TEXT_MUTED,
          border: `1px solid ${color}20`,
          borderRadius: 10,
          fontSize: 11,
          fontWeight: 600,
          padding: '7px 12px',
          width: 220,
          lineHeight: 1.4,
          boxShadow: `0 2px 10px rgba(0,0,0,0.2)`,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      });

      edges.push({
        id: `e-${careerId}-${traitId}`,
        source: careerId,
        target: traitId,
        style: { stroke: color, strokeWidth: 1.5, opacity: 0.35, strokeDasharray: '5 4' },
      });
    });
  });

  return { nodes, edges };
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function CareerMindMap({ recs }) {
  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => (recs && recs.length ? buildGraph(recs) : { nodes: [], edges: [] }),
    [recs]
  );

  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, , onEdgesChange] = useEdgesState(initEdges);

  if (!recs || recs.length === 0) return null;

  return (
    <div style={{
      width: '100%',
      height: 560,
      borderRadius: 20,
      overflow: 'hidden',
      border: '1px solid var(--ft-glass-border)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      background: BG_DARK,
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="rgba(0,212,255,0.06)"
          gap={24}
          size={1}
          style={{ background: BG_DARK }}
        />
        <Controls
          style={{
            background: 'var(--ft-bg-surface)',
            border: '1px solid var(--ft-glass-border)',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(n) => {
            if (n.id === 'center') return '#00d4ff';
            if (n.id.startsWith('career')) return '#8b5cf6';
            return 'rgba(0,0,0,0.1)';
          }}
          style={{
            background: 'var(--ft-bg-surface)',
            border: '1px solid var(--ft-glass-border)',
            borderRadius: 10,
          }}
          maskColor="rgba(0,0,0,0.15)"
        />
      </ReactFlow>
    </div>
  );
}
