import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { prepareWithSegments, layoutNextLine, type LayoutCursor } from '@chenglou/pretext';

interface IlluminatedTextProps {
  text: string;
  dropCap?: boolean;
  dropCapColor?: 'signal' | 'accent';
  dropCapLines?: number;
  fontSize?: number;
  lineHeightMultiplier?: number;
  className?: string;
}

const DROP_CAP_GAP = 12; // px between drop cap frame and body text

export default function IlluminatedText({
  text,
  dropCap = true,
  dropCapColor = 'signal',
  dropCapLines = 4,
  fontSize = 16,
  lineHeightMultiplier = 1.75,
  className = '',
}: IlluminatedTextProps) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  const firstParagraph = paragraphs[0] ?? '';
  const restParagraphs = paragraphs.slice(1);

  const initialLetter = dropCap && firstParagraph.length > 0 ? firstParagraph[0] : '';
  const bodyText = dropCap ? firstParagraph.slice(1) : firstParagraph;

  const containerRef = useRef<HTMLDivElement>(null);
  const dropCapRef = useRef<HTMLDivElement>(null);

  const [lines, setLines] = useState<string[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const [layoutDone, setLayoutDone] = useState(false);

  const lineHeightPx = fontSize * lineHeightMultiplier;

  const colorValue = dropCapColor === 'signal' ? '#4fd1d1' : '#8b7fd4';
  const dropCapFontSize = Math.round(lineHeightPx * dropCapLines);

  const runLayout = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    if (containerWidth === 0) return;

    let dropCapWidth = 0;
    let dropCapHeight = 0;

    if (dropCap && dropCapRef.current) {
      dropCapWidth = dropCapRef.current.offsetWidth + DROP_CAP_GAP;
      dropCapHeight = dropCapRef.current.offsetHeight;
    }

    const fontSpec = `${fontSize}px 'Gilda Display'`;
    const prepared = prepareWithSegments(bodyText, fontSpec);

    let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
    let y = 0;
    const result: string[] = [];

    while (true) {
      const availableWidth =
        dropCap && y < dropCapHeight
          ? containerWidth - dropCapWidth
          : containerWidth;

      const line = layoutNextLine(prepared, cursor, availableWidth);
      if (line === null) break;

      result.push(line.text);
      cursor = line.end;
      y += lineHeightPx;
    }

    const totalHeight = Math.max(y, dropCapHeight);
    setLines(result);
    setContainerHeight(totalHeight);
    setLayoutDone(true);
  }, [bodyText, dropCap, dropCapLines, fontSize, lineHeightPx]);

  useLayoutEffect(() => {
    // Run layout synchronously after DOM paints so there is no visible flash
    runLayout();

    // Re-run on resize
    const observer = new ResizeObserver(() => {
      setLayoutDone(false);
      runLayout();
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [runLayout]);

  return (
    <div className={className}>
      {/* First paragraph with drop cap */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: layoutDone ? containerHeight : undefined, minHeight: '4em' }}
      >
        {/* Amador drop cap initial */}
        {dropCap && initialLetter && (
          <div
            ref={dropCapRef}
            className="text-dropcap absolute top-0 left-0 select-none leading-none flex items-center justify-center"
            style={{
              fontSize: dropCapFontSize,
              color: colorValue,
              border: `2px solid ${colorValue}`,
              boxShadow: `0 0 12px ${colorValue}40, inset 0 0 8px ${colorValue}15`,
              padding: '8px 10px',
              lineHeight: 1,
            }}
          >
            {initialLetter}
          </div>
        )}

        {/* Body text lines positioned by pretext */}
        <div
          style={{
            visibility: layoutDone ? 'visible' : 'hidden',
            fontFamily: "'Gilda Display', serif",
            fontSize,
            lineHeight: lineHeightMultiplier,
            color: '#e8e4d9',
          }}
        >
          {lines.map((line, i) => {
            const lineY = i * lineHeightPx;
            const isDropCapLine =
              dropCap && dropCapRef.current
                ? lineY < (dropCapRef.current.offsetHeight || dropCapLines * lineHeightPx)
                : false;
            const dropCapOffset =
              isDropCapLine && dropCapRef.current
                ? dropCapRef.current.offsetWidth + DROP_CAP_GAP
                : 0;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: lineY,
                  left: dropCapOffset,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {/* Subsequent paragraphs — full width, no drop cap */}
      {restParagraphs.map((para, i) => (
        <p
          key={i}
          className="mt-6"
          style={{
            fontFamily: "'Gilda Display', serif",
            fontSize,
            lineHeight: lineHeightMultiplier,
            color: '#e8e4d9',
            letterSpacing: '0.03em',
          }}
        >
          {para}
        </p>
      ))}
    </div>
  );
}
