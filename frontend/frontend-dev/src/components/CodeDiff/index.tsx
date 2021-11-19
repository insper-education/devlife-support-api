import { useMemo } from "react";
import { diffLines } from "diff";
import { processBlocks, processLines } from "./utils";
import { ICodeBlockProps, ICodeDiffProps } from "./typeDefinitions";
import { Line, PaddingLine } from "./Line";
import "./styles.css";
import { useToggle } from "../../hooks/useToggle";

export function CodeDiff({
  left,
  right,
  leftTitle,
  rightTitle,
  language = "python",
  title,
}: ICodeDiffProps) {
  const { leftLines, rightLines } = useMemo(() => {
    const diff = diffLines(left?.trim(), right?.trim(), {
      ignoreCase: false,
      ignoreWhitespace: false,
      newlineIsToken: false,
    });

    const [leftBlocks, rightBlocks] = processBlocks(diff);
    const [leftLines, rightLines] = processLines(leftBlocks, rightBlocks);

    return { leftLines, rightLines };
  }, [left, right]);

  return (
    <div className="rounded mt-2 lg:mt-0 overflow-hidden compact-scrollbar">
      <div className="grid grid-flow-row-dense gap-0.5 sm:gap-0 sm:grid-cols-2 sm:grid-rows-1 justify-items-stretch w-full ">
        <CodeBlock
          lines={leftLines}
          language={language}
          description={leftTitle}
        />
        <CodeBlock
          lines={rightLines}
          language={language}
          description={rightTitle}
        />
      </div>
    </div>
  );
}

function CodeBlock({ lines, language, description }: ICodeBlockProps) {
  return (
    <div
      className="codeVisualizer flex flex-col overflow-auto rounded sm:rounded-none"
      style={{
        backgroundColor: "#2f323e",
      }}>
      <code
        className="min-w-max w-full"
        style={{ backgroundColor: "transparent" }}>
        {lines.map((line, index) =>
          line.isPadding ? (
            <PaddingLine key={"padding_" + index} />
          ) : (
            <Line
              key={"line_" + String(index) + line.lineNumber}
              line={line}
              language={language}
            />
          ),
        )}
      </code>
    </div>
  );
}
