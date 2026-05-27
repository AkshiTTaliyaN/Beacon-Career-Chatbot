import re
from typing import Dict, Optional

KEYWORDS = [
    "jee",
    "neet",
    "pcm",
    "pcb",
    "data science",
    "doctor",
    "engineer",
    "lawyer",
    "upsc",
    "salary",
    "career",
]


def match_query(message: str, aliases: Dict[str, str]) -> Optional[str]:
    lower_text = message.lower()
    for keyword in KEYWORDS:
        if re.search(r"\b" + re.escape(keyword) + r"\b", lower_text):
            return aliases.get(keyword, keyword)
    return None
