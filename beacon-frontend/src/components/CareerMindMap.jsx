import { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

/* ─── Design tokens ─────────────────────────────────────────────── */
const NAVY      = '#2C5492';
const NAVY_LIGHT = '#5f7dd6';
const NAVY_PALE  = '#e8eef9';
const TEAL      = '#14b8a6';
const AMBER     = '#f59e0b';

/* ─── Node rank → accent colour ──────────────────────────────────── */
const RANK_COLORS = ['#2C5492', '#5f7dd6', '#8b5cf6', '#14b8a6', '#f59e0b'];

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
const CAREER_X    = 340;  // x of career nodes
const TRAIT_X     = 680;  // x of trait sub-nodes
const ROW_HEIGHT  = 160;  // vertical gap between career rows

/* ─── Build nodes + edges from recommendations array ─────────────── */
function buildGraph(recs) {
  const nodes = [];
  const edges = [];

  // ── Central node ──────────────────────────────────────────────────
  nodes.push({
    id: 'center',
    type: 'default',
    position: { x: CX, y: CY + (recs.length - 1) * ROW_HEIGHT * 0.5 },
    data: { label: 'Your\nProfile' },
    style: {
      background: NAVY,
      color: '#fff',
      border: 'none',
      borderRadius: 16,
      fontWeight: 800,
      fontSize: 14,
      width: 110,
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      whiteSpace: 'pre-line',
      boxShadow: '0 6px 24px rgba(44,84,146,0.35)',
    },
  });

  recs.forEach((career, ci) => {
    const color    = RANK_COLORS[ci] || NAVY;
    const careerY  = ci * ROW_HEIGHT;
    const careerId = `career-${ci}`;

    // ── Career node ──────────────────────────────────────────────────
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
              padding: '1px 7px',
              marginBottom: 4,
              display: 'inline-block',
            }}>
              #{career.rank}
            </div>
            <div style={{ fontWeight: 800, color: NAVY, fontSize: 13, lineHeight: 1.3 }}>
              {career.title}
            </div>
            {career.salary && (
              <div style={{ fontSize: 11, color: '#15803d', fontWeight: 700, marginTop: 3 }}>
                {career.salary}
              </div>
            )}
          </div>
        ),
      },
      style: {
        background: '#fff',
        border: `2px solid ${color}`,
        borderRadius: 12,
        padding: '10px 14px',
        width: 180,
        boxShadow: '0 4px 14px rgba(44,84,146,0.14)',
      },
    });

    // ── Edge: center → career ──────────────────────────────────────
    edges.push({
      id: `e-center-${careerId}`,
      source: 'center',
      target: careerId,
      animated: false,
      style: { stroke: color, strokeWidth: 2, opacity: 0.7 },
    });

    // ── Trait sub-nodes ─────────────────────────────────────────────
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
          background: NAVY_PALE,
          color: NAVY,
          border: `1px solid ${color}40`,
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 600,
          padding: '6px 10px',
          width: 210,
          lineHeight: 1.4,
          boxShadow: '0 2px 6px rgba(44,84,146,0.07)',
        },
      });

      edges.push({
        id: `e-${careerId}-${traitId}`,
        source: careerId,
        target: traitId,
        style: { stroke: color, strokeWidth: 1.5, opacity: 0.5, strokeDasharray: '4 3' },
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
    <div style={{ width: '100%', height: 520, borderRadius: 16, overflow: 'hidden', border: `1px solid ${NAVY_PALE}`, boxShadow: '0 4px 24px rgba(44,84,146,0.10)' }}>
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
        <Background color={NAVY_PALE} gap={20} size={1} />
        <Controls
          style={{ background: '#fff', border: `1px solid ${NAVY_PALE}`, borderRadius: 8 }}
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(n) => (n.id === 'center' ? NAVY : n.id.startsWith('career') ? NAVY_LIGHT : NAVY_PALE)}
          style={{ background: '#fff', border: `1px solid ${NAVY_PALE}`, borderRadius: 8 }}
          maskColor="rgba(44,84,146,0.05)"
        />
      </ReactFlow>
    </div>
  );
}
