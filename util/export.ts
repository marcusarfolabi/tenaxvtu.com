import { domToCanvas } from 'modern-screenshot';
import jsPDF from 'jspdf';

export const downloadDashboardPDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // 1. Convert DOM to Canvas using the modern engine (supports OKLAB/OKLCH)
    const canvas = await domToCanvas(element, {
      scale: 2,
      backgroundColor: '#0a0a0a', // Use HEX here for PDF safety
      quality: 1,
    });

    // 2. Standard jsPDF conversion
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Modern Export Failed:", error);
    // Fallback: If it still fails, the last resort is a standard window.print()
    // but the modern-screenshot library usually solves the OKLAB issue.
  }
};