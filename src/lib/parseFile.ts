export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".txt") || name.endsWith(".md")) return file.text();
  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const r = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return r.value;
  }
  if (name.endsWith(".pdf")) {
    const pdfjs = await import("pdfjs-dist");
    const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    let out = "";
    for (let i = 1; i <= Math.min(doc.numPages, 60); i++) {
      const p = await doc.getPage(i);
      const c = await p.getTextContent();
      out += c.items.map((it) => ("str" in it ? it.str : "")).join(" ") + "\n";
    }
    return out;
  }
  throw new Error("Unsupported file type. Use .pdf, .docx or .txt");
}
