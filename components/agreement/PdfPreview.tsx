import { useCallback, useEffect, useRef, useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PageInfo {
  current: number;
  total: number | null;
}

export default function PdfPreview({
  fileUrl,
  zoomLevel,
  onPageInfoChange,
}: {
  fileUrl: string;
  zoomLevel: number;
  onPageInfoChange: (info: { current: number; total: number | null }) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [numPages, setNumPages] = useState(0);
  const [baseScale, setBaseScale] = useState<number | null>(null);

  useEffect(() => {
    setNumPages(0);
    setBaseScale(null);
    onPageInfoChange({ current: 1, total: null });
  }, [fileUrl]);


  const handleFirstPageLoad = useCallback((page: any) => {
    const naturalWidth = page.getViewport({ scale: 1 }).width;
    const availableWidth = (viewportRef.current?.clientWidth ?? 0) - 48;
    if (naturalWidth > 0 && availableWidth > 0) {
      setBaseScale(availableWidth / naturalWidth);
    } else {
      setBaseScale(1);
    }
  }, []);

  useEffect(() => {
    if (!numPages || baseScale === null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) {
          const idx = pageRefs.current.findIndex(
            (el) => el === mostVisible.target,
          );
          if (idx !== -1)
            onPageInfoChange({ current: idx + 1, total: numPages });
        }
      },
      { root: viewportRef.current, threshold: [0.5] },
    );
    pageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [numPages, baseScale]);

  const renderScale = baseScale !== null ? baseScale * zoomLevel : 1;

  return (
    <div
      ref={viewportRef}
      className="h-full overflow-auto[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          pageRefs.current = new Array(numPages).fill(null);
        }}
        loading={
          <p className="py-16 text-center text-[13px] text-muted-foreground">
            Loading document…
          </p>
        }
        error={
          <p className="py-16 text-center text-[13px] text-destructive">
            Failed to load this version's document.
          </p>
        }
      >
        {numPages > 0 && (
          <div
            ref={(el) => {
              pageRefs.current[0] = el;
            }}
            className="mx-auto mb-4 w-fit"
          >
            <Page
              pageNumber={1}
              scale={renderScale}
              renderAnnotationLayer={false}
              onLoadSuccess={handleFirstPageLoad}
            />
          </div>
        )}

        {/* Remaining pages wait until baseScale is known, so they render
            once, directly at the correct fit scale — no flash */}
        {baseScale !== null &&
          Array.from({ length: Math.max(numPages - 1, 0) }, (_, i) => {
            const pageNumber = i + 2;
            return (
              <div
                key={pageNumber}
                ref={(el) => {
                  pageRefs.current[pageNumber - 1] = el;
                }}
                className="mx-auto mb-4 w-fit bg-card shadow-sm"
              >
                <Page
                  pageNumber={pageNumber}
                  scale={renderScale}
                  renderAnnotationLayer={false}
                />
              </div>
            );
          })}
      </Document>
    </div>
  );
}