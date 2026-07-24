import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Paragraph, TextRun, AlignmentType, Packer } from 'docx';

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Paragraph, TextRun, AlignmentType, Packer } from 'docx';

/**
 * Generate a clean, high-resolution PDF from the A4 letter element.
 * Works seamlessly across Browsers and Mobile / Capacitor web views.
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const data = reader.result as string;
      resolve(data.split(",")[1]);
    };

    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
}
export async function exportToPDF(
  elementId: string,
  filename: string,
  onProgress?: (status: string) => void
): Promise<boolean> {
  try {
    onProgress?.('PDF तैयार हो रहा है...');
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('पत्र दृश्य उपलब्ध नहीं है।');
    }

    // Create a temporary hidden iframe with clean standard CSS for html2canvas to avoid Tailwind v4 oklch color parsing error
    const tempIframe = document.createElement('iframe');
    tempIframe.style.position = 'fixed';
    tempIframe.style.left = '-9999px';
    tempIframe.style.top = '-9999px';
    tempIframe.style.width = '800px';
    tempIframe.style.height = '1130px';
    tempIframe.style.border = 'none';
    document.body.appendChild(tempIframe);

    const iframeDoc = tempIframe.contentWindow?.document || tempIframe.contentDocument;
    if (!iframeDoc) {
      document.body.removeChild(tempIframe);
      throw new Error('PDF आईफ्रेम तैयार नहीं हो सका।');
    }

    // Clone element and clean editable attributes
    const clone = element.cloneNode(true) as HTMLElement;
    clone.removeAttribute('contenteditable');
    const editables = clone.querySelectorAll('[contenteditable]');
    editables.forEach((el) => el.removeAttribute('contenteditable'));

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Hind:wght@400;600;700&family=Noto+Serif+Devanagari:wght@400;600;700&display=swap');
            * {
              box-sizing: border-box;
              font-family: 'Noto Serif Devanagari', 'Hind', 'Mangal', serif !important;
              color: #111111 !important;
              box-shadow: none !important;
              text-shadow: none !important;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #ffffff !important;
              width: 794px;
            }
            .paper-a4 {
              background-color: #ffffff !important;
              background-image: none !important;
              color: #111111 !important;
              border: 1px solid #cbd5e1 !important;
              padding: 40px !important;
              width: 794px !important;
              box-sizing: border-box !important;
              min-height: 1000px;
            }
            p { margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <div id="capture-wrapper" style="width: 794px; background: #ffffff; padding: 10px;">
            ${clone.outerHTML}
          </div>
        </body>
      </html>
    `);
    iframeDoc.close();

    // Allow Google Fonts to render
    await new Promise((resolve) => setTimeout(resolve, 350));

    const targetNode = iframeDoc.getElementById('capture-wrapper') || iframeDoc.body;

    const canvas = await html2canvas(targetNode, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 800,
    });

    // Remove temp iframe
    if (document.body.contains(tempIframe)) {
      document.body.removeChild(tempIframe);
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Create jsPDF instance (A4 format)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

const cleanName = (filename || 'हिंदी_पत्र').replace(/[/\\?%*:|"<>]/g, '_');

const pdfBlob = pdf.output('blob');

if (Capacitor.isNativePlatform()) {

  const base64 = await blobToBase64(pdfBlob);

  const result = await Filesystem.writeFile({
    path: `${cleanName}.pdf`,
    data: base64,
    directory: Directory.Documents
  });

  await Share.share({
    title: cleanName,
    text: 'Generated PDF',
    url: result.uri
  });

  onProgress?.('PDF तैयार हो गई।');
} else {

  saveAs(pdfBlob, `${cleanName}.pdf`);

  onProgress?.('PDF डाउनलोड हो गया!');
}

return true;
  } catch (error) {
    console.error('PDF Export Error:', error);
    // Fallback to print dialog if canvas rendering fails
    handlePrintLetter(elementId);
    onProgress?.('प्रिंट संवाद प्रदर्शित किया गया');
    return true;
  }
}

/**
 * Generate a valid Microsoft Word (.docx) document using docx library.
 * Fully supports Hindi Devanagari text, custom formatting, and proper paragraphs.
 */
export async function exportToDocx(
  letterText: string,
  categoryTitle: string,
  onProgress?: (status: string) => void
): Promise<boolean> {
  try {
    onProgress?.('Word (.docx) फ़ाइल तैयार हो रही है...');
    const lines = letterText.split('\n');

    const docChildren: Paragraph[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        docChildren.push(new Paragraph({ text: '', spacing: { after: 120 } }));
        return;
      }

      // Check if line is a subject line
      const isSubject = trimmed.startsWith('विषय:') || trimmed.startsWith('Subject:');
      const isHeading = trimmed.startsWith('सेवा में,') || trimmed.startsWith('To,');

      docChildren.push(
        new Paragraph({
          alignment: isSubject ? AlignmentType.LEFT : AlignmentType.LEFT,
          spacing: { after: 140, line: 360 }, // 1.5 line spacing
          children: [
            new TextRun({
              text: line,
              bold: isSubject || isHeading,
              font: 'Mangal',
              size: isSubject ? 28 : 26, // 14pt or 13pt
            }),
          ],
        })
      );
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                bottom: 1440,
                left: 1440,
                right: 1440,
              },
            },
          },
          children: docChildren,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const cleanTitle = (categoryTitle || 'आवेदन_पत्र').replace(/[/\\?%*:|"<>]/g, '_');
    saveAs(blob, `${cleanTitle}_${new Date().toISOString().slice(0, 10)}.docx`);
    onProgress?.('Word फ़ाइल डाउनलोड हो गई!');
    return true;
  } catch (error) {
    console.error('Docx Export Fallback Triggered:', error);
    
    // Reliable Fallback to MS Word HTML Blob with UTF-8 BOM
    const htmlHeader = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${categoryTitle}</title>
<style>
body { font-family: 'Mangal', 'Noto Sans Devanagari', 'Calibri', sans-serif; font-size: 14pt; line-height: 1.8; padding: 30px; }
p { margin-bottom: 12px; }
.bold { font-weight: bold; }
</style>
</head><body>`;
    const htmlFooter = '</body></html>';

    const formattedBody = letterText
      .split('\n')
      .map((line) => `<p>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
      .join('');

    const fullHtml = htmlHeader + formattedBody + htmlFooter;
    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword;charset=utf-8' });
    const cleanTitle = (categoryTitle || 'आवेदन_पत्र').replace(/[/\\?%*:|"<>]/g, '_');
    saveAs(blob, `${cleanTitle}_${new Date().toISOString().slice(0, 10)}.doc`);
    return true;
  }
}

/**
 * Handle printing safely in both desktop browsers and mobile web views.
 */
export function handlePrintLetter(elementId: string): void {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      window.print();
      return;
    }

    // Blur active focused element so editing outline/cursor is hidden
    const activeEl = document.activeElement as HTMLElement;
    if (activeEl && activeEl.blur) {
      activeEl.blur();
    }

    // Clone element to avoid modifying the screen DOM
    const clone = element.cloneNode(true) as HTMLElement;
    clone.removeAttribute('contenteditable');
    const editables = clone.querySelectorAll('[contenteditable]');
    editables.forEach((el) => el.removeAttribute('contenteditable'));

    // Create or reuse hidden printable iframe for isolated system printing
    let printIframe = document.getElementById('system-mobile-print-iframe') as HTMLIFrameElement;
    if (!printIframe) {
      printIframe = document.createElement('iframe');
      printIframe.id = 'system-mobile-print-iframe';
      printIframe.style.position = 'fixed';
      printIframe.style.left = '-9999px';
      printIframe.style.top = '-9999px';
      printIframe.style.width = '0px';
      printIframe.style.height = '0px';
      printIframe.style.border = 'none';
      printIframe.style.visibility = 'hidden';
      document.body.appendChild(printIframe);
    }

    const iframeDoc = printIframe.contentWindow?.document || printIframe.contentDocument;
    if (!iframeDoc) {
      window.print();
      return;
    }

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="hi">
        <head>
          <meta charset="utf-8">
          <title>आवेदन पत्र - प्रिंट</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Hind:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@400;600;700&display=swap');
            
            @page {
              size: A4 portrait;
              margin: 15mm 15mm 15mm 15mm;
            }

            * {
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background-color: #ffffff !important;
              color: #111111 !important;
              font-family: 'Noto Serif Devanagari', 'Hind', 'Tiro Devanagari Hindi', 'Mangal', serif !important;
              font-size: 13.5pt;
              line-height: 1.85;
              width: 100% !important;
            }

            .print-wrapper {
              width: 100% !important;
              max-width: 210mm !important;
              margin: 0 auto !important;
              padding: 5mm !important;
              background: #ffffff !important;
              color: #111111 !important;
              border: none !important;
              box-shadow: none !important;
            }

            .paper-a4 {
              border: none !important;
              box-shadow: none !important;
              background: transparent !important;
              padding: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              min-height: auto !important;
            }

            p {
              margin-top: 0;
              margin-bottom: 12px;
            }

            *:focus {
              outline: none !important;
            }
          </style>
        </head>
        <body>
          <div class="print-wrapper">
            ${clone.outerHTML}
          </div>
        </body>
      </html>
    `);
    iframeDoc.close();

    // Trigger system print dialog after font and styles render
    setTimeout(() => {
      try {
        const frameWin = printIframe.contentWindow;
        if (frameWin) {
          frameWin.focus();
          frameWin.print();
        } else {
          window.print();
        }
      } catch (err) {
        console.error('System iframe print error:', err);
        window.print();
      }
    }, 250);
  } catch (e) {
    console.error('Print Error:', e);
    window.print();
  }
}
