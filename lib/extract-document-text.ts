const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function isDocx(file: File) {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}

function isPdf(file: File) {
  const name = file.name.toLowerCase();
  return name.endsWith(".pdf") || file.type === "application/pdf";
}

async function extractFromDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

async function extractFromPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");

  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const parts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    parts.push(pageText);
  }

  return parts.join("\n\n").trim();
}

export async function extractTextFromFile(file: File): Promise<string> {
  if (!isDocx(file) && !isPdf(file)) {
    throw new Error("Unsupported file type. Please upload a .docx or .pdf file.");
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new Error("File is too large. Maximum size is 10 MB.");
  }

  const text = isDocx(file) ? await extractFromDocx(file) : await extractFromPdf(file);

  if (!text) {
    throw new Error(
      "No text could be extracted from this file. Try a different document or paste your text manually.",
    );
  }

  return text;
}
