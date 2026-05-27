import json
from pathlib import Path
from typing import Dict, Optional, Any

TREE_FILE = Path(__file__).parent / "decision_tree.json"
with TREE_FILE.open("r", encoding="utf-8") as f:
    _tree_data = json.load(f)

TREE: Dict[str, Dict[str, Any]] = {item["id"]: item for item in _tree_data}
SESSION_STATE: Dict[str, str] = {}
START_ID = "Q1"


def _normalize_choice(choice: Optional[str]) -> str:
    if not choice:
        return ""
    return choice.strip().upper()


def _get_node(node_id: str) -> Dict[str, Any]:
    return TREE.get(node_id, TREE[START_ID])


def _start_session(session_id: str) -> Dict[str, Any]:
    SESSION_STATE[session_id] = START_ID
    return _get_node(START_ID)


def _get_current_node(session_id: str) -> Dict[str, Any]:
    node_id = SESSION_STATE.get(session_id, START_ID)
    if node_id not in TREE:
        node_id = START_ID
        SESSION_STATE[session_id] = node_id
    return _get_node(node_id)


def get_chatbot_response(session_id: str, choice: Optional[str] = None, message: Optional[str] = None) -> Dict[str, Any]:
    if choice:
        node = _get_current_node(session_id)
        if node.get("type") != "question":
            return node

        normalized_choice = _normalize_choice(choice)
        if not normalized_choice:
            raise ValueError("Choice must be a letter like A, B, C, D, or E.")

        selected_option = next(
            (opt for opt in node.get("options", []) if opt.get("letter") == normalized_choice),
            None,
        )
        if not selected_option:
            raise ValueError(f"Invalid choice '{choice}' for question {node.get('id')}")

        next_id = selected_option.get("next")
        if next_id not in TREE:
            raise ValueError(f"Next question id '{next_id}' is not available")

        SESSION_STATE[session_id] = next_id
        return _get_node(next_id)

    if session_id in SESSION_STATE:
        return _get_current_node(session_id)

    return _start_session(session_id)
