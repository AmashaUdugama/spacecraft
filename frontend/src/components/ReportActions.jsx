import { useState } from "react";

export default function ReportActions({ targetId, filename = "spacecraft-report" }) {
  const [generating, setGenerating] = useState(false);

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPDF() {
    setGenerating(true);
    const target = document.getElementById(targetId);
    if (!target) {
      setGenerating(false);
      return;
    }

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // Freeze all fade-in/ring/color-bar animations to their finished state
      // before capturing - otherwise html2canvas grabs whatever partial,
      // mid-animation frame happens to be showing at click time, producing a
      // washed-out or incomplete-looking PDF.
      target.classList.add("pdf-capturing");
      // Let the browser apply the style changes before we snapshot
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const canvas = await html2canvas(target, {
        scale: 2,
        backgroundColor: "#f6f4ef",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      target.classList.remove("pdf-capturing");
      setGenerating(false);
    }
  }

  return (
    <div className="report-actions no-print">
      <button type="button" className="report-action-btn" onClick={handlePrint}>
        🖨️ Print
      </button>
      <button type="button" className="report-action-btn" onClick={handleDownloadPDF} disabled={generating}>
        {generating ? "Generating..." : "⬇️ Download PDF"}
      </button>
    </div>
  );
}