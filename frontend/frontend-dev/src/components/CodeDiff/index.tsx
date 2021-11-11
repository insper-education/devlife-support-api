import { useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import colorTheme from "./colorTheme";
import { diffLines } from "diff";
import { useToggle } from "../../hooks/useToggle";
import { processBlocks, processLines, TLine } from "./utils";

interface ICodeDiffProps {
  left: string;
  right: string;
  leftTitle?: string;
  rightTitle?: string;
  language?: "python" | "css" | "javascript";
  title?: number;
}

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
      <div className="grid grid-cols-2 justify-items-stretch w-full ">
        <RenderCells lines={leftLines} language={language} />
        <RenderCells lines={rightLines} language={language} />
      </div>
    </div>
  );
}
interface IRenderCellsProps {
  lines: TLine[];
  language: string;
}
function RenderCells({ lines, language }: IRenderCellsProps) {
  return (
    <div
      className="flex flex-col overflow-auto"
      style={{
        backgroundColor: "#2f323e",
        color: "#76d9e6",
      }}>
      <code
        className="min-w-max w-full"
        style={{ backgroundColor: "transparent" }}>
        {lines.map((line, index) =>
          line.isPadding ? (
            <Padding key={"padding_" + index} />
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

interface ILineProps {
  line: TLine;
  language: string;
}
function Line({ line, language }: ILineProps) {
  const [selected, toggleSelect] = useToggle(false);

  const backgroundColor = line.added
    ? "bg-green-900"
    : line.removed
    ? "bg-red-900"
    : "bg-gray-900";

  const selectedBackgroundColor = selected ? "bg-opacity-90" : "";

  return (
    <div
      onClick={toggleSelect}
      className={`flex flex-row cursor-pointer bg-opacity-40 hover:bg-opacity-90 ${backgroundColor} ${selectedBackgroundColor}`}>
      {line.lineNumber && (
        <span className="text-center w-12 text-gray-400 font-bold bg-transparent-dark select-none">
          {line.lineNumber}
        </span>
      )}
      <span className="px-2">
        <SyntaxHighlighter
          language={language || "python"}
          style={colorTheme}
          PreTag={({ children }: any) => <span>{children}</span>}
          useInlineStyles={true}
          lineProps={{ style: { padding: "1rem" } }}>
          {line.value}
        </SyntaxHighlighter>
      </span>
    </div>
  );
}

function Padding() {
  return (
    <div
      style={{
        padding: "0.75rem",
        background:
          "repeating-linear-gradient(135deg, #202533, #202533 8.5px, #20253350 8.5px, #20253350 17px)",
      }}
    />
  );
}
