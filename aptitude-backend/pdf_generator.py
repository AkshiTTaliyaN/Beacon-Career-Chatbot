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

DARK_NAVY = colors.HexColor("#0f172a")
BLUE_PRIMARY = colors.HexColor("#3b82f6")
LIGHT_BG = colors.HexColor("#f8fafc")
GRAY_TEXT = colors.HexColor("#64748b")
BORDER_COLOR = colors.HexColor("#e2e8f0")

CATEGORY_COLORS = {
    "Investigative": colors.HexColor("#3b82f6"),
    "Realistic": colors.HexColor("#ef4444"),
    "Conventional": colors.HexColor("#22c55e"),
    "Enterprising": colors.HexColor("#f97316"),
    "Artistic": colors.HexColor("#8b5cf6"),
    "Social": colors.HexColor("#14b8a6"),
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

    # ── HEADER BANNER ──────────────────────────────────────────────────────────
    header_data = [[
        Paragraph("<font color='white' size='16'><b>Beacon</b></font>", styles["Normal"]),
        Paragraph(
            f"<font color='white' size='14'><b>Beacon Personality &amp; Career Report</b></font><br/>"
            f"<font color='#94a3b8' size='10'>{result['name']} • {result['class_level']} • {result['stream']}</font><br/>"
            f"<font color='#94a3b8' size='9'>{datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}</font>",
            styles["Normal"]
        ),
        Paragraph("<font color='white' size='9'>Beacon Report</font>", styles["Normal"]),
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
            Paragraph(result["primary_type"], label_style),
            Spacer(1, 4),
            Paragraph(f"Secondary: <b>{result['secondary_type']}</b>", secondary_style),
        ],
        Paragraph(result["description"], body_style),
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
    story.append(Paragraph("Top 3 Career Matches", h2_style))

    for i, career in enumerate(result["primary_careers"]):
        career_data = [[
            Paragraph(f"<b>{i+1}. {career['title']}</b>", ParagraphStyle("CareerTitle", parent=styles["Normal"], fontSize=12, textColor=DARK_NAVY)),
            Paragraph(f"<b>{career['salary']}</b>", ParagraphStyle("Salary", parent=styles["Normal"], fontSize=11, textColor=DARK_NAVY, alignment=TA_RIGHT)),
        ]]
        career_table = Table(career_data, colWidths=[10*cm, 6.5*cm])
        career_table.setStyle(TableStyle([
            ("LEFTPADDING", (0, 0), (0, 0), 10),
            ("RIGHTPADDING", (-1, -1), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BACKGROUND", (0, 0), (-1, -1), LIGHT_BG),
        ]))

        reason_para = Paragraph(career["reason"], ParagraphStyle("Reason", parent=styles["Normal"], fontSize=9, leading=14, textColor=GRAY_TEXT, leftIndent=10, rightIndent=10))
        stream_para = Paragraph(f"<font color='#3b82f6'><b>{career['stream']}</b></font>",
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

    # ── ENTRANCE EXAMS ───────────────────────────────────────────────────────
    story.append(Paragraph("Entrance Exams to Target", h2_style))
    for exam in result["entrance_exams"]:
        story.append(Paragraph(f"• <b>{exam['name']}</b> — {exam['desc']}", body_style))
        story.append(Spacer(1, 3))

    story.append(Spacer(1, 0.4*cm))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR))
    story.append(Spacer(1, 0.4*cm))

    # ── SKILLS TO BUILD ──────────────────────────────────────────────────────
    story.append(Paragraph("Skills to Build Now", h2_style))

    skills = result["skills_to_build"]
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
            if skill["name"]:
                cell = [
                    Paragraph(f"<b>{skill['name']}</b>", ParagraphStyle("SkillTitle", parent=styles["Normal"], fontSize=10, textColor=DARK_NAVY, spaceBefore=0)),
                    Spacer(1, 3),
                    Paragraph(skill["desc"], ParagraphStyle("SkillDesc", parent=styles["Normal"], fontSize=9, leading=13, textColor=GRAY_TEXT)),
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

    # ── CLOSING NOTE ─────────────────────────────────────────────────────────
    story.append(Paragraph("Closing Note", h2_style))
    story.append(Paragraph(result["closing_note"], ParagraphStyle("Closing", parent=styles["Normal"], fontSize=10, leading=16, textColor=GRAY_TEXT)))

    story.append(Spacer(1, 1*cm))

    # ── FOOTER ───────────────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph(
        "Beacon © 2026 — This report is an illustrative guide based on an assessment. For personalised counselling contact our team.",
        ParagraphStyle("Footer", parent=styles["Normal"], fontSize=8, textColor=GRAY_TEXT, alignment=TA_CENTER)
    ))

    doc.build(story)
    return buffer.getvalue()