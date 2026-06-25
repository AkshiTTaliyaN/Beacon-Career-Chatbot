import sys
import os

sys.path.append(r"c:\Users\Lenovo\Documents\EDCIL\code\beacon-backend")
from career_catalog import CAREER_CATALOG
from career_scorer import HOBBY_MAP

def get_career_domains(title: str) -> list[str]:
    title_lower = title.lower()
    domains = []
    
    # Map keywords to domains
    if any(k in title_lower for k in ["software", "developer", "cloud", "web3", "ethical hacker", "prompt", "ar/vr", "game ai", "blockchain"]):
        domains.append("software_engineering")
    if any(k in title_lower for k in ["data", "analyst", "science", "bioinformatics", "risk modeller"]):
        domains.append("data_science")
    if any(k in title_lower for k in ["scientist", "research", "biologist", "chemist", "forensics", "volcanologist"]):
        domains.append("research")
    if any(k in title_lower for k in ["engineer", "technician", "integrator", "installer", "vlsi"]):
        domains.append("engineering")
    if any(k in title_lower for k in ["designer", "illustrator", "artist", "compositor", "animator", "visualizer", "restorer", "customizer", "builder", "modder", "architect"]):
        domains.append("design")
    if any(k in title_lower for k in ["animator", "vfx", "motion graphics", "special effects", "sfx"]):
        domains.append("animation")
    if any(k in title_lower for k in ["architect", "urban planner", "visualizer", "sustainable building"]):
        domains.append("architecture")
    if any(k in title_lower for k in ["interior designer", "furniture"]):
        domains.append("interior_design")
    if any(k in title_lower for k in ["product manager", "product designer", "industrial designer", "toy designer", "footwear designer", "sneaker"]):
        domains.append("product_design")
    if any(k in title_lower for k in ["fashion", "textile", "stylist", "footwear"]):
        domains.append("fashion")
    if any(k in title_lower for k in ["journalist", "anchor", "vlogger", "writer", "editor", "copywriter", "novelist", "public relations", "pr", "relations"]):
        domains.append("media")
        domains.append("journalism")
    if any(k in title_lower for k in ["writer", "editor", "copywriter", "novelist", "author"]):
        domains.append("literature")
        domains.append("content")
    if any(k in title_lower for k in ["lawyer", "legal", "judge", "compliance", "auditor", "safety auditor", "privacy"]):
        domains.append("law")
    if any(k in title_lower for k in ["dj", "music", "sound", "audio", "dubbing", "voice", "actor", "comedian", "choreographer", "vfx", "compositor", "film", "director"]):
        domains.append("performing_arts")
    if any(k in title_lower for k in ["music", "sound", "audio"]):
        domains.append("music_production")
    if any(k in title_lower for k in ["event", "wedding", "coordinator", "producer", "tournament director", "curator"]):
        domains.append("event_management")
    if any(k in title_lower for k in ["sports", "athlete", "gamer", "coach", "fitness", "calisthenics"]):
        domains.append("sports")
    if any(k in title_lower for k in ["army", "police", "officer", "ips", "defence", "pilot", "forensics"]):
        domains.append("defence")
    if any(k in title_lower for k in ["physiotherapist", "recreation therapist", "sports medicine", "rehabilitation", "therapist", "counsellor", "psychologist", "coach"]):
        domains.append("physiotherapy")
    if any(k in title_lower for k in ["doctor", "surgeon", "mbbs", "dentist", "nurse", "healthcare", "medical", "pharmacist", "therapist", "nutritionist", "hospital"]):
        domains.append("healthcare")
        domains.append("medicine")
    if any(k in title_lower for k in ["geography", "town planner", "urban", "landscape", "gis"]):
        domains.append("geography")
    if any(k in title_lower for k in ["environmental", "wildlife", "climate", "sustainability", "solar", "renewable", "ecologist", "biologist"]):
        domains.append("environmental_science")
    if any(k in title_lower for k in ["professor", "lecturer", "academic", "research scholar", "teacher", "educator", "education"]):
        domains.append("academia")
        domains.append("education")
    if any(k in title_lower for k in ["ias", "ips", "civil services", "public policy", "government", "diplomat", "customs"]):
        domains.append("civil_services")
    if any(k in title_lower for k in ["political", "policy", "relations", "sociologist", "advocate"]):
        domains.append("politics")
    if any(k in title_lower for k in ["biotechnology", "genetic", "bioinformatics", "bio"]):
        domains.append("biotechnology")
    if any(k in title_lower for k in ["linguist", "translator", "interpreter", "language"]):
        domains.append("linguistics")
    if any(k in title_lower for k in ["ifs", "international relations", "diplomat"]):
        domains.append("foreign_services")
    if any(k in title_lower for k in ["social worker", "ngo", "community", "volunteer", "youth", "counsellor", "therapist"]):
        domains.append("social_work")
        domains.append("ngo")
    if any(k in title_lower for k in ["hr", "talent", "recruitment", "acquisition", "personnel"]):
        domains.append("hr")
    if any(k in title_lower for k in ["marketing", "brand", "sales", "growth", "public relations", "pr", "advocacy"]):
        domains.append("marketing")
    if any(k in title_lower for k in ["consultant", "analyst", "business", "manager", "strategist", "specialist", "advisory", "entrepreneur", "startup", "merchandising", "real estate", "franchisee"]):
        domains.append("corporate")
    if any(k in title_lower for k in ["veterinarian", "veterinary", "animal", "dog", "wildlife"]):
        domains.append("veterinary")
    if any(k in title_lower for k in ["hotel", "chef", "culinary", "hospitality", "brewer", "barista", "catering"]):
        domains.append("hospitality")
    if any(k in title_lower for k in ["food", "nutritionist", "dietitian", "brewer", "fermentation"]):
        domains.append("food_technology")
    if any(k in title_lower for k in ["agricultural", "agronomist", "farming", "farmer", "hydroponics", "soil"]):
        domains.append("agriculture")
    if any(k in title_lower for k in ["automobile", "automotive", "bicycle", "mechanic", "ev", "aerospace"]):
        domains.append("automobile")
    if any(k in title_lower for k in ["chartered accountant", "accountancy", "ca", "cfa", "finance", "investment", "banking", "tax", "payroll", "underwriter", "trader", "broker", "portfolio", "audit", "accountant"]):
        domains.append("finance")
        
    return list(set(domains))

unmapped = []
for c in CAREER_CATALOG:
    title = c["title"]
    domains = get_career_domains(title)
    if not domains:
        unmapped.append(title)
        
print(f"Total unmapped careers: {len(unmapped)}")
for t in unmapped:
    print(f" - {t}")
