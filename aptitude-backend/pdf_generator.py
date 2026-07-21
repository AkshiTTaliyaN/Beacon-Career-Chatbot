from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics import renderPDF
from io import BytesIO
from datetime import datetime

def safe_html(v):
    if v is None:
        return ""
    return str(v).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

DARK_NAVY = colors.HexColor("#0f172a")
BLUE_PRIMARY = colors.HexColor("#3b82f6")
LIGHT_BG = colors.HexColor("#f8fafc")
GRAY_TEXT = colors.HexColor("#64748b")
BORDER_COLOR = colors.HexColor("#e2e8f0")

# Big Five (OCEAN) uses ONE neutral accent. Traits are not good/bad, so the
# green/amber/red aptitude palette is deliberately not used here.
OCEAN_COLOR = colors.HexColor("#6C5CE7")
OCEAN_COLOR_HEX = "#6C5CE7"

CATEGORY_COLORS = {
    "Investigative": colors.HexColor("#3b82f6"),
    "Realistic": colors.HexColor("#ef4444"),
    "Conventional": colors.HexColor("#22c55e"),
    "Enterprising": colors.HexColor("#f97316"),
    "Artistic": colors.HexColor("#8b5cf6"),
    "Social": colors.HexColor("#14b8a6"),
}

# Phased skill roadmap per primary RIASEC type. Mirrors ACTION_PLAN in
# aptitude-frontend/src/pages/ResultPage.jsx so the PDF matches the on-screen
# report. Keyed by full type name (result["primary_type"]).
ACTION_PLAN = {
    "Investigative": [
        ("Class 11 (Now)", ["Strengthen mathematics and analytical subjects", "Start learning Python or basic programming", "Read scientific articles and journals weekly", "Join science Olympiads or research clubs"]),
        ("Class 12", ["Begin JEE/NEET/IISER prep alongside boards", "Build small data or research projects", "Apply for summer research programs (KVPI, IISER, IIT internships)", "Strengthen English for international applications"]),
        ("After Class 12", ["Pursue B.Tech, BSc Research, or MBBS based on stream", "Engage in research from year one of college", "Consider international research opportunities", "Build a profile of papers, projects, or internships"]),
    ],
    "Realistic": [
        ("Class 11 (Now)", ["Focus on physics, mathematics, and applied subjects", "Take up hands-on hobbies (electronics, mechanics, building)", "Visit workshops, factories, or engineering exhibitions", "Try AutoCAD or basic CAD software"]),
        ("Class 12", ["Start JEE preparation seriously", "Build small physical or technical projects", "Visit IITs/NITs on open day if possible", "Develop strong drawing and spatial reasoning"]),
        ("After Class 12", ["Pursue B.Tech, Diploma, or applied engineering", "Take internships at engineering firms", "Build a portfolio of completed technical projects", "Consider specialisations like robotics, automotive, or aerospace"]),
    ],
    "Artistic": [
        ("Class 11 (Now)", ["Build a portfolio of your creative work", "Learn one design tool (Figma, Photoshop, or Canva)", "Take art, music, writing, or photography classes", "Follow creative professionals on social media for inspiration"]),
        ("Class 12", ["Prepare for NID, NIFT, or other design entrance exams", "Build a strong, organised digital portfolio", "Attempt small creative freelance projects", "Read design and creative industry publications"]),
        ("After Class 12", ["Pursue B.Des, BFA, or Mass Communication degrees", "Build a professional online portfolio (Behance, Dribbble)", "Take internships at creative studios or media houses", "Develop a strong personal brand and online presence"]),
    ],
    "Social": [
        ("Class 11 (Now)", ["Volunteer with a local NGO or community group", "Develop public speaking and communication skills", "Read introductory psychology or sociology books", "Join debate, MUN, or peer counselling activities"]),
        ("Class 12", ["Prepare for CUET if pursuing humanities", "Begin shadowing teachers, doctors, or counsellors", "Maintain a journal of your volunteering experiences", "Apply for leadership roles in school"]),
        ("After Class 12", ["Pursue Psychology, Education, Social Work, or Medicine", "Complete internships in counselling or NGO settings", "Build a track record of impact in community work", "Consider higher studies in clinical or counselling psychology"]),
    ],
    "Enterprising": [
        ("Class 11 (Now)", ["Read business case studies and entrepreneur biographies", "Take leadership roles in school clubs or events", "Develop public speaking and presentation skills", "Start a small project, selling, organising, or building"]),
        ("Class 12", ["Prepare for IPM, CLAT, or commerce entrance exams", "Build a strong CV with leadership experience", "Start a small entrepreneurial side project", "Develop financial literacy and business reading"]),
        ("After Class 12", ["Pursue BBA, B.Com, LLB, or related fields", "Join entrepreneurship cells and business clubs", "Take internships at startups or consulting firms", "Build your network early through LinkedIn and events"]),
    ],
    "Conventional": [
        ("Class 11 (Now)", ["Strengthen mathematics, accounting, and economics", "Master MS Excel and basic spreadsheet skills", "Develop strong organisational and time-management habits", "Read business newspapers (Mint, Economic Times)"]),
        ("Class 12", ["Prepare for CA Foundation or commerce entrance exams", "Build accuracy in numerical and analytical work", "Develop typing speed and digital literacy", "Maintain strong academic discipline"]),
        ("After Class 12", ["Pursue B.Com, CA, CFA, or BBA in Finance", "Take internships at audit firms or banks", "Build certifications in finance and data analysis", "Aim for stable, professional career tracks early"]),
    ],
}

def score_bar(label, score, bar_color):
    """Create a progress bar row as a table."""
    bar_width = 340
    fill_width = int(bar_width * score / 100)

    d = Drawing(bar_width + 60, 22)
    # Background bar
    d.add(Rect(0, 4, bar_width, 12, fillColor=colors.HexColor("#e2e8f0"), strokeColor=None))
    # Fill bar
    if fill_width > 0:
        d.add(Rect(0, 4, fill_width, 12, fillColor=bar_color, strokeColor=None))
    # Percentage text
    d.add(String(bar_width + 8, 5, f"{score}%", fontSize=10, fillColor=DARK_NAVY))
    return d

def generate_pdf(result: dict) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=0,
        bottomMargin=2*cm
    )

    styles = getSampleStyleSheet()
    story = []

    # Which frontend asked for this PDF. A standalone student has no Manzil
    # account and no dashboard, so the closing CTA must not send them to one.
    # Defaults to "portal" so existing behaviour is unchanged if unset.
    app_mode = result.get("app_mode", "portal")
    is_standalone = app_mode == "standalone"

    res_name = safe_html(result.get('name', ''))
    res_class = safe_html(result.get('class_level', ''))
    raw_stream = result.get('stream', '')
    res_stream = safe_html("Stream not decided" if raw_stream == "none" else raw_stream)
    res_primary = safe_html(result.get('primary_type', ''))
    res_secondary = safe_html(result.get('secondary_type', ''))
    res_desc = safe_html(result.get('description', ''))

    # ── HEADER BANNER ──────────────────────────────────────────────────────────
    header_data = [[
        Paragraph("<font color='white' size='16'><b>Manzil</b></font>", styles["Normal"]),
        Paragraph(
            f"<font color='white' size='14'><b>Manzil Personality &amp; Career Report</b></font><br/>"
            f"<font color='#94a3b8' size='10'>{res_name} • {res_class} • {res_stream}</font><br/>"
            f"<font color='#94a3b8' size='9'>{datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}</font>",
            styles["Normal"]
        ),
        Paragraph("<font color='white' size='9'>Manzil Report</font>", styles["Normal"]),
    ]]
    header_table = Table(header_data, colWidths=[4*cm, 10*cm, 3*cm])
    header_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), DARK_NAVY),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 16),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
        ("LEFTPADDING", (0, 0), (0, 0), 16),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 0.5*cm))

    # ── PERSONALITY OVERVIEW ──────────────────────────────────────────────────
    h2_style = ParagraphStyle("H2", parent=styles["Normal"], fontSize=16, fontName="Helvetica-Bold", spaceAfter=8, textColor=DARK_NAVY)
    body_style = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=15, textColor=DARK_NAVY)
    label_style = ParagraphStyle("Label", parent=styles["Normal"], fontSize=13, fontName="Helvetica-Bold", textColor=BLUE_PRIMARY)
    secondary_style = ParagraphStyle("Secondary", parent=styles["Normal"], fontSize=10, textColor=GRAY_TEXT)

    story.append(Paragraph("Personality Overview", h2_style))

    overview_data = [[
        [
            Paragraph(res_primary, label_style),
            Spacer(1, 4),
            Paragraph(f"Secondary: <b>{res_secondary}</b>", secondary_style),
        ],
        Paragraph(res_desc, body_style),
    ]]
    overview_table = Table(overview_data, colWidths=[4.5*cm, 12*cm])
    overview_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (0, 0), 0),
        ("LEFTPADDING", (1, 0), (1, 0), 12),
    ]))
    story.append(overview_table)
    story.append(Spacer(1, 0.4*cm))

    # ── RIASEC SCORE BARS ────────────────────────────────────────────────────
    story.append(Paragraph("RIASEC Scores", ParagraphStyle("ScoreHead", parent=styles["Normal"], fontSize=11, fontName="Helvetica-Bold", textColor=GRAY_TEXT, spaceAfter=6)))

    for item in result["riasec_scores"]:
        cat = item["category"]
        bar_color = CATEGORY_COLORS.get(cat, BLUE_PRIMARY)
        row = [[
            Paragraph(f"<b>{cat}</b>", ParagraphStyle("CatLabel", parent=styles["Normal"], fontSize=10, textColor=DARK_NAVY)),
            score_bar(cat, item["score"], bar_color),
        ]]
        bar_table = Table(row, colWidths=[3.5*cm, 13*cm])
        bar_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("TOPPADDING", (0, 0), (-1, -1), 2),
        ]))
        story.append(bar_table)

    story.append(Spacer(1, 0.5*cm))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR))
    story.append(Spacer(1, 0.4*cm))

    # ── TOP CAREER MATCHES ───────────────────────────────────────────────────
    if result.get("primary_careers"):
        story.append(Paragraph("Top 3 Career Matches", h2_style))
        story.append(Spacer(1, 0.2*cm))

        for i, career in enumerate(result["primary_careers"][:3]):
            c_title = safe_html(career.get("title", ""))
            c_salary = safe_html(career.get("salary", ""))
            c_reason = safe_html(career.get("description") or career.get("reason", ""))
            c_stream = safe_html(career.get("stream", ""))

            career_data = [[
                Paragraph(f"<b>{i+1}. {c_title}</b>", ParagraphStyle("CareerTitle", parent=styles["Normal"], fontSize=12, textColor=DARK_NAVY)),
                Paragraph(f"<b>{c_salary}</b>", ParagraphStyle("Salary", parent=styles["Normal"], fontSize=11, textColor=DARK_NAVY, alignment=TA_RIGHT)),
            ]]
            career_table = Table(career_data, colWidths=[10*cm, 6.5*cm])
            career_table.setStyle(TableStyle([
                ("LEFTPADDING", (0, 0), (0, 0), 10),
                ("RIGHTPADDING", (-1, -1), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BACKGROUND", (0, 0), (-1, -1), LIGHT_BG),
            ]))

            reason_para = Paragraph(c_reason, ParagraphStyle("Reason", parent=styles["Normal"], fontSize=9, leading=14, textColor=GRAY_TEXT, leftIndent=10, rightIndent=10))
            stream_para = Paragraph(f"<font color='#3b82f6'><b>{c_stream}</b></font>",
                                    ParagraphStyle("Stream", parent=styles["Normal"], fontSize=9, leftIndent=10, spaceBefore=4, spaceAfter=8))

            block_data = [[career_table], [reason_para], [stream_para]]
            block = Table(block_data, colWidths=[16.5*cm])
            block.setStyle(TableStyle([
                ("BOX", (0, 0), (-1, -1), 1, BORDER_COLOR),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]))
            story.append(block)
            story.append(Spacer(1, 0.3*cm))

        story.append(Spacer(1, 0.3*cm))
        story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR))
        story.append(Spacer(1, 0.4*cm))

    # ── APTITUDE SNAPSHOT ────────────────────────────────────────────────────
    aptitude = result.get("aptitude_scores") or {}
    if aptitude:
        story.append(Paragraph("Aptitude Snapshot", h2_style))
        story.append(Paragraph(
            "Self-rated ability across six skill areas (from the aptitude section of your test).",
            ParagraphStyle("AptSub", parent=styles["Normal"], fontSize=9, textColor=GRAY_TEXT, spaceAfter=6)
        ))
        level_colors = {"High": colors.HexColor("#22c55e"), "Medium": colors.HexColor("#f97316"), "Low": colors.HexColor("#ef4444")}
        for skill_data in aptitude.values():
            label = safe_html(skill_data.get("label", ""))
            pct = skill_data.get("percentage", 0)
            level = skill_data.get("level", "")
            bar_color = level_colors.get(level, BLUE_PRIMARY)
            row = [[
                Paragraph(f"<b>{label}</b>", ParagraphStyle("AptLabel", parent=styles["Normal"], fontSize=9, textColor=DARK_NAVY)),
                score_bar(label, pct, bar_color),
                Paragraph(f"<font color='{bar_color.hexval().replace('0x', '#')}'><b>{safe_html(level)}</b></font>",
                          ParagraphStyle("AptLevel", parent=styles["Normal"], fontSize=9)),
            ]]
            apt_table = Table(row, colWidths=[4.5*cm, 10*cm, 2*cm])
            apt_table.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
            ]))
            story.append(apt_table)

        fit_note = safe_html(result.get("aptitude_fit_note", ""))
        if fit_note:
            story.append(Spacer(1, 0.2*cm))
            story.append(Paragraph(f"<i>{fit_note}</i>", ParagraphStyle("FitNote", parent=styles["Normal"], fontSize=9, leading=13, textColor=GRAY_TEXT)))

        story.append(Spacer(1, 0.4*cm))
        story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR))
        story.append(Spacer(1, 0.4*cm))

    # ── PERSONALITY STYLE (BIG FIVE / OCEAN) ─────────────────────────────────
    # Neutral palette: one indigo accent for every trait. High/Low describe
    # position on a trait, not ability, so no green/amber/red here.
    ocean_summary = result.get("ocean_summary") or []
    if ocean_summary:
        story.append(Paragraph("Your Personality Style", h2_style))
        story.append(Paragraph(
            "Based on the Big Five (OCEAN) model, this shows how you naturally think, feel, and work day to day. "
            "These describe your style, not your ability, there are no better or worse results here.",
            ParagraphStyle("OceanSub", parent=styles["Normal"], fontSize=9, leading=13, textColor=GRAY_TEXT, spaceAfter=6)
        ))
        for t in ocean_summary:
            label = safe_html(t.get("label", ""))
            pct = t.get("percentage", 0)
            level = safe_html(t.get("level", ""))
            workstyle = safe_html(t.get("workstyle", ""))
            row = [[
                Paragraph(f"<b>{label}</b>", ParagraphStyle("OceanLabel", parent=styles["Normal"], fontSize=9, textColor=DARK_NAVY)),
                score_bar(label, pct, OCEAN_COLOR),
                Paragraph(f"<font color='{OCEAN_COLOR_HEX}'><b>{level}</b></font>",
                          ParagraphStyle("OceanLevel", parent=styles["Normal"], fontSize=9)),
            ]]
            ocean_table = Table(row, colWidths=[4.5*cm, 10*cm, 2*cm])
            ocean_table.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
            ]))
            story.append(ocean_table)
            if workstyle:
                story.append(Paragraph(
                    workstyle,
                    ParagraphStyle("OceanDesc", parent=styles["Normal"], fontSize=8.5, leading=12, textColor=GRAY_TEXT, leftIndent=6, spaceAfter=5)
                ))

        story.append(Spacer(1, 0.4*cm))
        story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR))
        story.append(Spacer(1, 0.4*cm))

    # ── INTERESTS & HOBBIES ──────────────────────────────────────────────────
    hobbies = result.get("selected_hobbies") or []
    interest_careers = result.get("interest_careers") or []
    if hobbies or interest_careers:
        story.append(Paragraph("Your Interests", h2_style))
        if hobbies:
            story.append(Paragraph(
                f"<b>Hobbies you selected:</b> {safe_html(', '.join(hobbies))}",
                ParagraphStyle("Hobbies", parent=styles["Normal"], fontSize=10, leading=15, textColor=DARK_NAVY, spaceAfter=6)
            ))
        if interest_careers:
            story.append(Paragraph(
                "<b>Careers aligned with these interests:</b>",
                ParagraphStyle("IntHead", parent=styles["Normal"], fontSize=10, textColor=DARK_NAVY, spaceAfter=4)
            ))
            for c in interest_careers[:4]:
                story.append(Paragraph(
                    f"• <b>{safe_html(c.get('title', ''))}</b>"
                    + (f" ({safe_html(c.get('salary', ''))})" if c.get("salary") else ""),
                    ParagraphStyle("IntItem", parent=styles["Normal"], fontSize=9, leading=14, textColor=GRAY_TEXT, leftIndent=8)
                ))
        story.append(Spacer(1, 0.4*cm))
        story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR))
        story.append(Spacer(1, 0.4*cm))

    # ── ENTRANCE EXAMS ───────────────────────────────────────────────────────
    exams = result.get("entrance_exams") or []
    if exams:
        story.append(Paragraph("Entrance Exams to Explore", h2_style))
        exam_rows = []
        for i in range(0, len(exams), 2):
            pair = exams[i:i+2]
            cells = []
            for exam in pair:
                cells.append([
                    Paragraph(f"<b>{safe_html(exam.get('name', ''))}</b>", ParagraphStyle("ExamName", parent=styles["Normal"], fontSize=10, textColor=BLUE_PRIMARY)),
                    Spacer(1, 2),
                    Paragraph(safe_html(exam.get("desc", "")), ParagraphStyle("ExamDesc", parent=styles["Normal"], fontSize=9, leading=13, textColor=GRAY_TEXT)),
                ])
            while len(cells) < 2:
                cells.append([Paragraph("", styles["Normal"])])
            exam_rows.append(cells)
        for cells in exam_rows:
            exam_table = Table([cells], colWidths=[8*cm, 8*cm])
            exam_table.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]))
            story.append(exam_table)
        story.append(Spacer(1, 0.3*cm))
        story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR))
        story.append(Spacer(1, 0.4*cm))

    # ── CLOSING RECOMMENDATIONS SECTION ───────────────────────────────────────
    # Portal students get sent to their dashboard, where Engine 1 has combined
    # this assessment with their onboarding profile. Standalone students have no
    # account and no dashboard, so pointing them there would be a dead end.
    if is_standalone:
        story.append(Paragraph("What To Do With This Report", h2_style))
        story.append(Spacer(1, 0.2*cm))
        cta_text = (
            "This report brings together four things: your RIASEC personality type, the "
            "interests and hobbies you selected, your self-rated aptitude across six skill "
            "areas, and your Big Five personality style. Together they point toward the "
            "career directions above. <b>Read it with your parents and a teacher you trust, "
            "use the entrance exams and skills sections to plan your next year, and treat "
            "the career matches as directions worth exploring rather than a final answer. "
            "You can retake this assessment any time.</b>"
        )
    else:
        story.append(Paragraph("Your Personalized Career Recommendations", h2_style))
        story.append(Spacer(1, 0.2*cm))
        cta_text = (
            "We have combined your onboarding academic profile, subject ratings, "
            "RIASEC personality scores, and passions/hobbies to generate your final "
            "career recommendations. <b>To view your unified, stream-aligned, and "
            "interest-aligned career matches, please log in "
            "to the Lakshayaveer Platform and check your Student Dashboard.</b>"
        )

    story.append(Paragraph(cta_text, ParagraphStyle("CTA", parent=styles["Normal"], fontSize=10, leading=16, textColor=DARK_NAVY)))
    story.append(Spacer(1, 0.6*cm))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR))
    story.append(Spacer(1, 0.4*cm))

    # ── SKILLS TO BUILD ──────────────────────────────────────────────────────
    story.append(Paragraph("Skills to Build Now", h2_style))

    skills = result.get("skills_to_build", [])
    # 3 column grid
    rows = []
    for i in range(0, len(skills), 3):
        row = skills[i:i+3]
        while len(row) < 3:
            row.append({"name": "", "desc": ""})
        rows.append(row)

    for row in rows:
        cells = []
        for skill in row:
            if skill.get("name"):
                sk_name = safe_html(skill["name"])
                sk_desc = safe_html(skill["desc"])
                cell = [
                    Paragraph(f"<b>{sk_name}</b>", ParagraphStyle("SkillTitle", parent=styles["Normal"], fontSize=10, textColor=DARK_NAVY, spaceBefore=0)),
                    Spacer(1, 3),
                    Paragraph(sk_desc, ParagraphStyle("SkillDesc", parent=styles["Normal"], fontSize=9, leading=13, textColor=GRAY_TEXT)),
                ]
            else:
                cell = [Paragraph("", styles["Normal"])]
            cells.append(cell)
        skill_table = Table([cells], colWidths=[5.3*cm, 5.3*cm, 5.3*cm])
        skill_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(skill_table)

    story.append(Spacer(1, 0.4*cm))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR))
    story.append(Spacer(1, 0.4*cm))

    # ── PERSONALISED ROADMAP ─────────────────────────────────────────────────
    roadmap = ACTION_PLAN.get(result.get("primary_type", ""), [])
    if roadmap:
        primary_color = CATEGORY_COLORS.get(result.get("primary_type", ""), BLUE_PRIMARY)
        story.append(Paragraph("Your Personalised Roadmap", h2_style))
        story.append(Spacer(1, 0.1*cm))
        story.append(Paragraph(
            "A step-by-step timeline from now until college, built around your personality type.",
            ParagraphStyle("RoadmapSub", parent=styles["Normal"], fontSize=9.5, leading=14, textColor=GRAY_TEXT)
        ))
        story.append(Spacer(1, 0.3*cm))
        phase_title_style = ParagraphStyle("PhaseTitle", parent=styles["Normal"], fontSize=11, textColor=primary_color, spaceBefore=0, spaceAfter=2)
        action_style = ParagraphStyle("ActionItem", parent=styles["Normal"], fontSize=9.5, leading=14, textColor=DARK_NAVY, leftIndent=10, bulletIndent=0)
        for phase_name, actions in roadmap:
            story.append(Paragraph(f"<b>{safe_html(phase_name)}</b>", phase_title_style))
            for action in actions:
                story.append(Paragraph(safe_html(action), action_style, bulletText="•"))
            story.append(Spacer(1, 0.25*cm))
        story.append(Spacer(1, 0.2*cm))
        story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR))
        story.append(Spacer(1, 0.4*cm))

    # ── CLOSING NOTE ─────────────────────────────────────────────────────────
    story.append(Paragraph("Closing Note", h2_style))
    closing = safe_html(result.get("closing_note", ""))
    story.append(Paragraph(closing, ParagraphStyle("Closing", parent=styles["Normal"], fontSize=10, leading=16, textColor=GRAY_TEXT)))

    story.append(Spacer(1, 1*cm))

    # ── FOOTER ───────────────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph(
        "Lakshayaveer © 2026 - This report is an illustrative guide based on an assessment. For personalised counselling contact our team.",
        ParagraphStyle("Footer", parent=styles["Normal"], fontSize=8, textColor=GRAY_TEXT, alignment=TA_CENTER)
    ))

    doc.build(story)
    return buffer.getvalue()