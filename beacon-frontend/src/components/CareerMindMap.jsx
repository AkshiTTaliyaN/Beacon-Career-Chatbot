import React, { useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/futuristic.css';

/* ─── Rank accent colors (matching portal theme) ─── */
const RANK_COLORS = ['#00d4ff', '#8b5cf6', '#ff006e', '#00ff88', '#f59e0b'];

/* ─── Extract short trait clauses from the reason string ─── */
function extractTraits(reason = '', max = 2) {
  if (!reason) return [];
  const clauses = reason
    .split(/[.;—]+/)
    .map(s => s.trim())
    .filter(s => s.length > 6 && s.length < 60);
  return clauses.slice(0, max);
}

/* ─── Coordinates and Heights ─── */
const CX = 0;
const CY = 0;
const CAREER_X = 350;
const TRAIT_X = 700;
const ROW_HEIGHT = 160;

/* ─── Graph Generator ─── */
function buildGraph(recs, selectedId) {
  const nodes = [];
  const edges = [];
  const top5 = recs.slice(0, 5);

  const isAnySelected = Boolean(selectedId);
  const isCenterSelected = selectedId === 'center';

  // 1. Center "Your Profile" Node
  nodes.push({
    id: 'center',
    type: 'default',
    position: { x: CX, y: CY + (top5.length - 1) * ROW_HEIGHT * 0.5 },
    data: { label: 'Your\nProfile' },
    style: {
      background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
      color: '#fff',
      border: 'none',
      borderRadius: 20,
      fontWeight: 800,
      fontSize: 13,
      width: 110,
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      whiteSpace: 'pre-line',
      boxShadow: '0 0 30px rgba(0,212,255,0.35), 0 0 60px rgba(139,92,246,0.15)',
      fontFamily: 'Inter, system-ui, sans-serif',
      opacity: isAnySelected && !isCenterSelected ? 0.4 : 1,
      transition: 'opacity 0.25s',
    },
  });

  // 2. Careers (Top 5) and Traits
  top5.forEach((career, ci) => {
    const color = RANK_COLORS[ci] || '#00d4ff';
    const careerY = ci * ROW_HEIGHT;
    const careerId = `career-${ci}`;

    const isCareerSelected = selectedId === careerId;
    const isPathActive = selectedId === careerId || selectedId?.startsWith(`trait-${ci}`);
    const isDimmed = isAnySelected && !isPathActive && !isCenterSelected;

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
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 8px',
              marginBottom: 5,
              display: 'inline-block',
              boxShadow: `0 0 10px ${color}40`,
              letterSpacing: '0.03em',
            }}>
              #{career.rank}
            </div>
            <div style={{ fontWeight: 800, color: 'var(--ft-text-primary)', fontSize: 13, lineHeight: 1.3 }}>
              {career.title}
            </div>
            {career.salary && (
              <div style={{ fontSize: 11, color: '#00ff88', fontWeight: 700, marginTop: 4 }}>
                {career.salary}
              </div>
            )}
          </div>
        ),
      },
      style: {
        background: 'var(--ft-bg-secondary)',
        border: `1.5px solid ${isCareerSelected ? color : `${color}40`}`,
        borderRadius: 14,
        padding: '12px 16px',
        width: 175,
        boxShadow: isCareerSelected 
          ? `0 0 25px ${color}35, 0 8px 32px rgba(0,0,0,0.4)`
          : `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${color}15`,
        opacity: isDimmed ? 0.35 : 1,
        transition: 'opacity 0.25s, border-color 0.25s, box-shadow 0.25s',
      },
    });

    edges.push({
      id: `e-center-${careerId}`,
      source: 'center',
      target: careerId,
      animated: isPathActive,
      style: { 
        stroke: color, 
        strokeWidth: isPathActive ? 3.5 : 2, 
        opacity: isDimmed ? 0.15 : 0.7,
        transition: 'stroke-width 0.25s, opacity 0.25s',
      },
    });

    // Traits (max 2)
    const traits = extractTraits(career.reason, 2);
    traits.forEach((trait, ti) => {
      const traitId = `trait-${ci}-${ti}`;
      const traitY = careerY + (ti - (traits.length - 1) / 2) * 58;

      const isTraitSelected = selectedId === traitId;
      const isTraitDimmed = isAnySelected && !isTraitSelected && selectedId !== careerId && !isCenterSelected;

      nodes.push({
        id: traitId,
        type: 'default',
        position: { x: TRAIT_X, y: traitY },
        data: { label: trait },
        style: {
          background: 'var(--ft-bg-tertiary)',
          color: 'var(--ft-text-secondary)',
          border: `1px solid ${isTraitSelected ? color : `${color}20`}`,
          borderRadius: 10,
          fontSize: 10.5,
          fontWeight: 600,
          padding: '7px 12px',
          width: 205,
          lineHeight: 1.4,
          boxShadow: isTraitSelected ? `0 0 15px ${color}20` : `0 2px 10px rgba(0,0,0,0.2)`,
          fontFamily: 'Inter, system-ui, sans-serif',
          opacity: isTraitDimmed ? 0.35 : 1,
          transition: 'opacity 0.25s, border-color 0.25s',
        },
      });

      edges.push({
        id: `e-${careerId}-${traitId}`,
        source: careerId,
        target: traitId,
        style: { 
          stroke: color, 
          strokeWidth: isTraitSelected || isCareerSelected ? 2.5 : 1.5, 
          opacity: isTraitDimmed ? 0.1 : 0.35, 
          strokeDasharray: '5 4',
          transition: 'stroke-width 0.25s, opacity 0.25s',
        },
      });
    });
  });

  return { nodes, edges };
}

/* ─── Detail Panel ─── */
function DetailPanel({ career, color, onClose }) {
  const rankEmoji = career.rank === 1 ? '🥇' : career.rank === 2 ? '🥈' : career.rank === 3 ? '🥉' : '⭐';

  const handleConsultExpert = () => {
    window.history.pushState({}, '', `/expert?career=${encodeURIComponent(career.title)}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleExploreLibrary = () => {
    window.history.pushState({}, '', `/careers`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '1.5rem',
        background: 'var(--ft-bg-secondary)',
        borderLeft: `2.5px solid ${color}`,
        borderRadius: 14,
        overflowY: 'auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: `${color}18`, border: `1px solid ${color}40`,
          borderRadius: 20, padding: '4px 12px',
        }}>
          <span style={{ fontSize: 13 }}>{rankEmoji}</span>
          <span style={{ color, fontWeight: 800, fontSize: 11, letterSpacing: '0.03em' }}>
            Rank #{career.rank} Match
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--ft-text-secondary)',
            fontSize: 22,
            cursor: 'pointer',
            lineHeight: 1,
            padding: 4,
          }}
        >✕</button>
      </div>

      <h3 style={{
        margin: '0 0 0.5rem',
        fontSize: '1.35rem',
        fontWeight: 900,
        color: 'var(--ft-text-primary)',
        lineHeight: 1.25,
      }}>
        {career.title}
      </h3>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.35rem' }}>
        {career.stream && (
          <span style={{
            background: 'rgba(0,212,255,0.12)',
            border: '1px solid rgba(0,212,255,0.2)',
            color: '#00d4ff',
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: '0.78rem',
            fontWeight: 700,
          }}>
            {career.stream}
          </span>
        )}
        {career.salary && (
          <span style={{
            background: 'rgba(0,255,136,0.12)',
            border: '1px solid rgba(0,255,136,0.2)',
            color: '#00ff88',
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: '0.78rem',
            fontWeight: 700,
          }}>
            {career.salary}
          </span>
        )}
      </div>

      <div style={{ flex: 1, color: 'var(--ft-text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        <h4 style={{ color: 'var(--ft-text-secondary)', margin: '0 0 0.4rem', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Why it matches</h4>
        <p style={{ margin: 0, fontSize: '0.88rem' }}>{career.reason}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={handleConsultExpert}
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem',
            boxShadow: '0 4px 15px rgba(0,212,255,0.25)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Consult AI Expert →
        </button>
        <button
          onClick={handleExploreLibrary}
          style={{
            background: 'var(--ft-bg-tertiary)',
            color: 'var(--ft-text-primary)',
            border: '1px solid var(--ft-glass-border)',
            borderRadius: 10,
            padding: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--ft-bg-tertiary)'}
        >
          Explore in Library
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function CareerMindMap({ recs }) {
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const top5 = useMemo(() => (recs ? recs.slice(0, 5) : []), [recs]);
  const extraCareers = useMemo(() => (recs ? recs.slice(5) : []), [recs]);

  const { nodes: initNodes, edges: initEdges } = useMemo(() => {
    return recs && recs.length 
      ? buildGraph(recs, selectedNodeId)
      : { nodes: [], edges: [] };
  }, [recs, selectedNodeId]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync state with memoized nodes/edges when graph is rebuilt
  useEffect(() => {
    setNodes(initNodes);
    setEdges(initEdges);
  }, [initNodes, initEdges, setNodes, setEdges]);

  if (!recs || recs.length === 0) return null;

  const handleNodeClick = (event, node) => {
    setSelectedNodeId(node.id);
    if (node.id.startsWith('career-')) {
      const idx = parseInt(node.id.split('-')[1], 10);
      setSelectedCareer(recs[idx]);
    } else if (node.id.startsWith('trait-')) {
      const careerIdx = parseInt(node.id.split('-')[1], 10);
      setSelectedCareer(recs[careerIdx]);
    } else if (node.id === 'center') {
      setSelectedCareer(null);
    }
  };

  const handlePaneClick = () => {
    setSelectedCareer(null);
    setSelectedNodeId(null);
  };

  // Color matching for selection highlights
  const selColor = selectedCareer
    ? (RANK_COLORS[selectedCareer.rank - 1] || '#00d4ff')
    : '#00d4ff';

  return (
    <div>
      {/* Mind Map Canvas */}
      <div style={{ display: 'flex', gap: '1.5rem', width: '100%', height: 560, marginBottom: '2rem' }}>
        <div 
          style={{ 
            flex: selectedCareer ? '0 0 65%' : '1 1 100%', 
            transition: 'all 0.3s ease', 
            height: '100%',
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid var(--ft-glass-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            background: 'var(--ft-bg-tertiary)',
            position: 'relative'
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              color="rgba(0,212,255,0.06)"
              gap={24}
              size={1}
              style={{ background: 'var(--ft-bg-tertiary)' }}
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
                if (n.id.startsWith('career')) {
                  const idx = parseInt(n.id.split('-')[1], 10);
                  return RANK_COLORS[idx] || '#8b5cf6';
                }
                return 'rgba(255,255,255,0.05)';
              }}
              style={{
                background: 'var(--ft-bg-surface)',
                border: '1px solid var(--ft-glass-border)',
                borderRadius: 10,
              }}
              maskColor="rgba(0,0,0,0.25)"
            />
          </ReactFlow>
        </div>

        {/* Dynamic Sidebar Panel */}
        {selectedCareer && (
          <div 
            className="ft-glow-cyan ft-animate-in" 
            style={{ 
              flex: '0 0 32.5%', 
              height: '100%',
              borderRadius: 14,
              border: '1px solid var(--ft-glass-border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
          >
            <DetailPanel
              career={selectedCareer}
              color={selColor}
              onClose={handlePaneClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
