// Builds the downloadable A4 PDF for a private project documentation version.
//
// Each part of the printed sheet is laid out as real DOM (see ProjectPdfExport), captured to a
// canvas, then placed on A4 pages. The header band — logo plus platform name, project code and
// version — is captured once and stamped on every page, and the page counter is written by the
// PDF library so it always matches the real page count.

const PAGE_WIDTH = 794; // A4 at 96 dpi
const PAGE_HEIGHT = 1123;
const SHEET_MARGIN_X = 46;
const CONTENT_WIDTH = PAGE_WIDTH - SHEET_MARGIN_X * 2;
const CAPTURE_SCALE = 2;
const MIN_SLICE = 28;

export class PdfExportCancelled extends Error {
    constructor() {
        super("PDF export cancelled");
        this.name = "PdfExportCancelled";
    }
}

async function captureNode(node, html2canvas) {
    return html2canvas(node, {
        backgroundColor: "#ffffff",
        logging: false,
        scale: CAPTURE_SCALE,
        useCORS: true,
    });
}

function sliceCanvas(canvas, sourceY, height) {
    const scale = canvas.height / (canvas.__cssHeight || canvas.height);
    const sourcePixelY = Math.round(sourceY * scale);
    const pixelHeight = Math.max(1, Math.min(canvas.height - sourcePixelY, Math.round(height * scale)));
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = pixelHeight;
    const context = slice.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, slice.width, slice.height);
    context.drawImage(
        canvas,
        0,
        sourcePixelY,
        canvas.width,
        pixelHeight,
        0,
        0,
        canvas.width,
        pixelHeight,
    );
    return { canvas: slice, cssHeight: pixelHeight / scale };
}

export function projectPdfFileName(project, document) {
    const code = project?.project_code || "project";
    const version = document?.version ? `-v${document.version}` : "";
    return `${code}${version}-documentation.pdf`;
}

export async function buildProjectPdf({
    headerNode,
    footerNode,
    sections,
    fileName,
    isEnglish,
    onProgress,
    isCancelled,
}) {
    if (!headerNode || !sections?.length) throw new Error("PDF layout is not ready.");

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
    ]);

    const ensureRunning = () => {
        if (isCancelled?.()) throw new PdfExportCancelled();
    };

    const headerHeight = headerNode.offsetHeight;
    const footerHeight = footerNode?.offsetHeight ?? 46;
    const headerCanvas = await captureNode(headerNode, html2canvas);
    const footerCanvas = footerNode ? await captureNode(footerNode, html2canvas) : null;

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [PAGE_WIDTH, PAGE_HEIGHT],
        compress: true,
    });
    pdf.setProperties({
        title: fileName,
        subject: "TechSphere project documentation",
        creator: "TechSphere",
    });

    const contentTop = headerHeight + 22;
    const contentBottom = PAGE_HEIGHT - footerHeight - 12;
    const usableHeight = contentBottom - contentTop;
    let cursorY = contentTop;
    let pageCount = 0;

    const stampChrome = () => {
        pdf.addImage(headerCanvas, "PNG", 0, 0, PAGE_WIDTH, headerHeight);
        if (footerCanvas) {
            pdf.addImage(footerCanvas, "PNG", 0, PAGE_HEIGHT - footerHeight, PAGE_WIDTH, footerHeight);
        }
        pageCount += 1;
    };

    const startPage = () => {
        if (pageCount > 0) pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT], "portrait");
        stampChrome();
        cursorY = contentTop;
    };

    startPage();

    for (let index = 0; index < sections.length; index += 1) {
        ensureRunning();
        const section = sections[index];
        onProgress?.({ index, total: sections.length, section });

        const canvas = await captureNode(section.node, html2canvas);
        const cssHeight = section.node.offsetHeight;
        canvas.__cssHeight = cssHeight;
        let consumed = 0;
        let remaining = cssHeight;

        while (remaining > 0.5) {
            ensureRunning();
            const space = contentBottom - cursorY;
            if (space < MIN_SLICE && remaining > space) {
                startPage();
                continue;
            }
            const sliceHeight = Math.min(remaining, space || usableHeight);
            const slice = sliceCanvas(canvas, consumed, sliceHeight);
            pdf.addImage(slice.canvas, "PNG", SHEET_MARGIN_X, cursorY, CONTENT_WIDTH, slice.cssHeight);
            cursorY += slice.cssHeight;
            consumed += slice.cssHeight;
            remaining -= slice.cssHeight;
            if (remaining > 0.5) startPage();
        }

        // Breathing room between sections, kept inside the page.
        cursorY += 14;
        if (cursorY > contentBottom - MIN_SLICE) startPage();
    }

    const totalPages = pdf.getNumberOfPages();
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(92, 109, 133);
    for (let page = 1; page <= totalPages; page += 1) {
        pdf.setPage(page);
        const label = `${page} / ${totalPages}`;
        const x = isEnglish ? PAGE_WIDTH - SHEET_MARGIN_X : SHEET_MARGIN_X;
        pdf.text(label, x, PAGE_HEIGHT - 18, { align: isEnglish ? "right" : "left" });
    }

    return { pageCount: totalPages, fileName, pdf };
}

export function downloadPdf(pdf, fileName) {
    pdf.save(fileName);
}
