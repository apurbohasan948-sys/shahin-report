import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Captures an HTML element representing an A4 document and exports it as a high-fidelity PDF.
 * This helper bypasses iframe restrictions and excludes browser print header/footers.
 * 
 * @param elementId The id of the DOM element to export (e.g., 'medical-report-sheet')
 * @param filename The downloaded file name
 * @param onProgress Callback trigger for load indicators
 */
export async function downloadReportAsPDF(
  elementId: string,
  filename: string = "medical_report.pdf",
  onProgress?: (active: boolean) => void
) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`PDF Exporter: Element with ID "${elementId}" not found.`);
    return false;
  }

  if (onProgress) onProgress(true);

  // Buffer original styles to draw seamlessly
  const originalBoxShadow = element.style.boxShadow;
  const originalBorder = element.style.border;
  
  // Set clean layout for screenshot
  element.style.boxShadow = "none";
  element.style.border = "none";

  try {
    // Render HTML component onto visual Canvas
    const canvas = await html2canvas(element, {
      scale: 3.5, // Ultra sharp image quality for micro fonts and signatures
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: 794, // Lock context viewport standard width equivalent to A4 scale
      windowHeight: 1123,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Initialise PDF with physical millimeters
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // Should be exactly 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // Should be exactly 297mm

    // Draw the entire visual canvas onto the bounds of the A4 page
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");

    // File saver execution
    pdf.save(filename);
    
    return true;
  } catch (err) {
    console.error("PDF download failed in canvas engine:", err);
    return false;
  } finally {
    // Restore visual layout styles in view
    element.style.boxShadow = originalBoxShadow;
    element.style.border = originalBorder;
    if (onProgress) onProgress(false);
  }
}
