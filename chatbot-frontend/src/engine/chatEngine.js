import { DECISION_TREE } from "../data/decisionTree";

// Build a map of nodes by id for quick lookup
const nodeMap = new Map();
for (const node of DECISION_TREE) {
  nodeMap.set(node.id, node);
}

function normalizeNode(node) {
  if (!node) return null;
  return {
    id: node.id || null,
    type: node.type || "question",
    question: node.question || null,
    title: node.title || null,
    options: node.options || [],
    careers: node.careers || [],
    exams: node.exams || [],
    message: node.message || null,
    contact_options: node.contact_options || [],
    next_steps: node.next_steps || [],
    timeline: node.timeline || null,
  };
}

// Session manager stores session state in-memory for the running frontend
const sessions = new Map();

function createSession(sessionId = "default") {
  const initialNode = DECISION_TREE.find((n) => n.type === "question" || n.id === "Q1") || DECISION_TREE[0];
  const state = {
    currentNodeId: initialNode ? initialNode.id : null,
    path: [], // [{ nodeId, selectedLetter }]
  };
  sessions.set(sessionId, state);
  return state;
}

function getSession(sessionId = "default") {
  if (!sessions.has(sessionId)) return createSession(sessionId);
  return sessions.get(sessionId);
}

export function start(sessionId = "default") {
  const state = createSession(sessionId);
  const node = nodeMap.get(state.currentNodeId);
  return normalizeNode(node);
}

export function getCurrentNode(sessionId = "default") {
  const state = getSession(sessionId);
  const node = nodeMap.get(state.currentNodeId);
  return normalizeNode(node);
}

export function selectOption(sessionId = "default", letter) {
  const state = getSession(sessionId);
  const current = nodeMap.get(state.currentNodeId);
  if (!current) return null;
  if (!current.options || current.options.length === 0) return null;
  const chosen = current.options.find((o) => o.letter === letter);
  if (!chosen) return null;

  state.path.push({ nodeId: current.id, selectedLetter: letter });
  const nextId = chosen.next;
  if (!nextId) return null;
  state.currentNodeId = nextId;
  const nextNode = nodeMap.get(nextId);
  return normalizeNode(nextNode);
}

export function canGoBack(sessionId = "default") {
  const state = getSession(sessionId);
  return state.path.length > 0;
}

export function goBack(sessionId = "default") {
  const state = getSession(sessionId);
  if (state.path.length === 0) return getCurrentNode(sessionId);
  const last = state.path.pop();
  state.currentNodeId = last.nodeId;
  return getCurrentNode(sessionId);
}

export function reset(sessionId = "default") {
  sessions.delete(sessionId);
  return start(sessionId);
}

export function getProgress(sessionId = "default") {
  const state = getSession(sessionId);
  // Max depth of any path is about 5 questions deep
  const MAX_DEPTH = 5;
  const percent = Math.min(100, Math.round((state.path.length / MAX_DEPTH) * 100));
  return { stepsTaken: state.path.length, totalQuestions: MAX_DEPTH, percent };
}

// Backend-like wrapper to mimic get_chatbot_response(session_id, choice, message)
export function getChatbotResponse(sessionId = "default", choice = null, message = null) {
  if (!sessions.has(sessionId)) createSession(sessionId);
  if (choice) {
    const node = selectOption(sessionId, choice);
    return node;
  }
  return getCurrentNode(sessionId);
}

export default {
  start,
  selectOption,
  getCurrentNode,
  getProgress,
  canGoBack,
  goBack,
  reset,
  getChatbotResponse,
};
