import os
import sys

# Add current directory to path to import local career_catalog
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from career_catalog import CAREER_CATALOG

output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "source_documents")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "careers_list.txt")

with open(output_path, "w", encoding="utf-8") as f:
    f.write("MANZIL CAREER COUNSELLING PORTAL - OFFICIAL CAREERS CATALOG\n")
    f.write("This file contains the complete list of careers supported by the Manzil Portal.\n\n")
    for idx, c in enumerate(CAREER_CATALOG):
        f.write(f"=== CAREER {idx+1}: {c['title']} ===\n")
        f.write(f"Title: {c['title']}\n")
        f.write(f"Expected Salary Range: {c['salary']}\n")
        f.write(f"RIASEC Primary Trait: {c['riasec_primary']}\n")
        f.write(f"RIASEC Secondary Trait: {c['riasec_secondary']}\n")
        f.write(f"Compatible High School Streams: {', '.join(c['streams'])}\n")
        
        subjects = [f"{s} (weight: {w})" for s, w in c.get("subject_weights", {}).items()]
        f.write(f"Key Academic Subjects: {', '.join(subjects) if subjects else 'None (General/Creative)'}\n")
        
        workstyles = [f"{w} (weight: {v})" for w, v in c.get("workstyle_weights", {}).items()]
        f.write(f"Workstyle Traits: {', '.join(workstyles)}\n")
        
        f.write(f"Aligned Priorities: {', '.join(c['priority_alignment'])}\n")
        f.write(f"Employment Sector: {c['sector']}\n")
        f.write(f"Education Cost Level: {c['cost_level']}\n")
        f.write(f"Requires Relocation: {'Yes' if c['requires_relocation'] else 'No'}\n")
        f.write(f"Description and Matching Reason: {c['reason']}\n\n")

print(f"Successfully generated {output_path} with {len(CAREER_CATALOG)} careers!")
