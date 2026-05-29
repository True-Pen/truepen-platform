import { jsPDF } from "jspdf";

export type AnalysisPdfData = {
  dateLabel: string;
  text: string;
  aiScore: number;
  humanScore: number;
  academicScore: number;
  feedbackItems: string[];
};

const MARGIN = 20;
const LINE_HEIGHT = 6;

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function addWrappedText(
  doc: jsPDF,
  text: string,
  y: number,
  options: {
    fontSize?: number;
    fontStyle?: "normal" | "bold";
    indent?: number;
  } = {},
): number {
  const { fontSize = 11, fontStyle = "normal", indent = 0 } = options;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - MARGIN * 2 - indent;

  doc.setFontSize(fontSize);
  doc.setFont("helvetica", fontStyle);
  doc.setTextColor(40, 40, 40);

  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  for (const line of lines) {
    y = ensureSpace(doc, y, LINE_HEIGHT);
    doc.text(line, MARGIN + indent, y);
    y += LINE_HEIGHT;
  }
  return y;
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  y = ensureSpace(doc, y, LINE_HEIGHT + 4);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text(title, MARGIN, y);
  return y + LINE_HEIGHT + 2;
}

export function downloadAnalysisPdf(data: AnalysisPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  // Brand header
  doc.setFillColor(59, 130, 246);
  doc.roundedRect(MARGIN, y - 4, 10, 10, 2, 2, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TP", MARGIN + 2.8, y + 2.5);

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("TruePen", MARGIN + 14, y + 3);

  y += 14;
  doc.setDrawColor(220, 220, 220);
  doc.line(MARGIN, y, doc.internal.pageSize.getWidth() - MARGIN, y);
  y += 10;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  y = ensureSpace(doc, y, LINE_HEIGHT);
  doc.text("Writing Analysis Report", MARGIN, y);
  y += LINE_HEIGHT + 2;

  y = addWrappedText(doc, `Analysis date: ${data.dateLabel}`, y, { fontSize: 10 });
  y += 4;

  y = addSectionTitle(doc, "Scores", y);
  const scores = [
    { label: "AI-Likeness", value: data.aiScore },
    { label: "Human Authenticity", value: data.humanScore },
    { label: "Academic Quality", value: data.academicScore },
  ];
  for (const score of scores) {
    y = addWrappedText(doc, `${score.label}: ${score.value}/100`, y, { fontSize: 11 });
  }
  y += 4;

  y = addSectionTitle(doc, "Feedback", y);
  if (data.feedbackItems.length === 0) {
    y = addWrappedText(doc, "No feedback recorded.", y, { fontSize: 11 });
  } else {
    for (const item of data.feedbackItems) {
      y = addWrappedText(doc, `• ${item}`, y, { fontSize: 11, indent: 2 });
      y += 2;
    }
  }
  y += 4;

  y = addSectionTitle(doc, "Submitted text", y);
  y = addWrappedText(doc, data.text, y, { fontSize: 10 });

  const safeDate = data.dateLabel.replace(/[^\d]/g, "-").slice(0, 20) || "report";
  doc.save(`truepen-analysis-${safeDate}.pdf`);
}
