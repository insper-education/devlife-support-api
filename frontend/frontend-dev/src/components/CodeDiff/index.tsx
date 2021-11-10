import { ReactNode, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import colorTheme from "./colorTheme";
import { diffLines, Change } from "diff";
import { range } from "../../helpers";

interface ICodeDiffProps {
  left: string;
  right: string;
  leftTitle?: string;
  rightTitle?: string;
  language?: "python" | "css" | "javascript";
  title?: number;
}
interface DiffBlock extends Change {
  isAdditionOnly?: boolean;
  isDeletionOnly?: boolean;
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

    const leftBlocks: DiffBlock[] = [];
    const rightBlocks: DiffBlock[] = [];

    diff.forEach((currentBlock, index) => {
      if (!currentBlock.added && !currentBlock.removed) {
        leftBlocks.push(currentBlock);
        rightBlocks.push(currentBlock);
        return;
      }

      const previousBlock = diff[index - 1];
      const nextBlock = diff[index + 1];

      const paddingBlock = {
        value: "",
        added: false,
        removed: false,
        count: currentBlock.count,
      };

      const isAddition = !!currentBlock.added;
      const isDeletion = !!currentBlock.removed;

      const nextIsNotAdditin = !nextBlock || !nextBlock.added;
      const previousIsNotDeletion = !previousBlock || !previousBlock?.removed;

      const isAdditionOnly = isAddition && previousIsNotDeletion;
      const isDeletionOnly = isDeletion && nextIsNotAdditin;

      if (isAdditionOnly) {
        leftBlocks.push({ ...paddingBlock, isAdditionOnly });
        rightBlocks.push(currentBlock);
        return;
      }
      if (isDeletionOnly) {
        leftBlocks.push(currentBlock);
        rightBlocks.push({ ...paddingBlock, isDeletionOnly });
        return;
      }

      if (isAddition) {
        rightBlocks.push(currentBlock);
      } else if (isDeletion) {
        leftBlocks.push(currentBlock);
      } else {
        leftBlocks.push(currentBlock);
        rightBlocks.push(currentBlock);
      }
    });

    const [leftLines, rightLines] = leftBlocks.reduce(
      (accumulator, _, currentIndex) => {
        const leftBlock = leftBlocks[currentIndex];
        const rightBlock = rightBlocks[currentIndex];

        const [leftLines, rightLines] = accumulator;

        const newLeftLines = leftBlock.value
          .replace(/\n$/, "")
          .split("\n")
          .map<ILine>((line, idx) => ({
            lineNumber: String(
              leftLines.filter((l) => !l.isPadding).length + idx + 1,
            ),
            added: leftBlock.added,
            removed: leftBlock.removed,
            value: line,
            isPadding: !!leftBlock.isAdditionOnly,
          }));

        const newRightLines = rightBlock.value
          .replace(/\n$/, "")
          .split("\n")
          .map<ILine>((line, idx) => ({
            lineNumber: String(
              rightLines.filter((l) => !l.isPadding).length + idx + 1,
            ),
            added: rightBlock.added,
            removed: rightBlock.removed,
            value: line,
            isPadding: !!rightBlock.isDeletionOnly,
          }));

        const removedLines = newLeftLines.length || 0;
        const addedLines = newRightLines.length || 0;

        const paddingCount = Math.abs(removedLines - addedLines);
        const hasLeftPadding = removedLines < addedLines;
        const hasRightPadding = removedLines > addedLines;

        const generatePadding = (): ILine => ({ isPadding: true });

        const leftPadding = hasLeftPadding
          ? range(paddingCount).map(generatePadding)
          : [];
        const rightPadding = hasRightPadding
          ? range(paddingCount).map(generatePadding)
          : [];

        return [
          [...leftLines, ...newLeftLines, ...leftPadding],
          [...rightLines, ...newRightLines, ...rightPadding],
        ];
      },
      [[] as ILine[], [] as ILine[]],
    );

    return { leftLines, rightLines };
  }, [left, right]);

  return (
    <div className="rounded mt-2 lg:mt-0 overflow-hidden compact-scrollbar">
      <div className="grid grid-cols-2 justify-items-stretch w-full ">
        <RenderCells lines={leftLines} />
        <RenderCells lines={rightLines} />
      </div>
    </div>
  );
}

type ILine =
  | {
      lineNumber: string;
      value: string | undefined;
      added: boolean | undefined;
      removed: boolean | undefined;
      isPadding: false;
    }
  | {
      lineNumber?: string;
      value?: string;
      added?: boolean;
      removed?: boolean;
      isPadding: true;
    };

interface IRenderCellsProps {
  lines: ILine[];
}
function RenderCells({ lines }: IRenderCellsProps) {
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
            <Line key={"line_" + index + line.lineNumber} line={line} />
          ),
        )}
      </code>
    </div>
  );
}

interface ILineProps {
  line: ILine;
}
function Line({ line }: ILineProps) {
  const backgroundColor = line.added
    ? "#20ff0050"
    : line.removed
    ? "#ff200050"
    : "transparent";

  return (
    <pre
      style={{ backgroundColor, minWidth: "100" }}
      className="hover:text-opacity-80 cursor-pointer hover:opacity-80">
      {line.lineNumber && (
        <span className="px-2 mr-2 text-white bg-transparent-dark select-none">
          {line.lineNumber}
        </span>
      )}
      {line.value}
    </pre>
  );
}

function Padding() {
  return (
    <div
      style={{
        padding: "0.75rem",
        background:
          "repeating-linear-gradient(135deg, #2f323e, #2f323e 8.5px, #00000020 8.5px, #00000020 17px)",
      }}
    />
  );
}
function CodeBlock({ children }: { children: JSX.Element }) {
  const numberOfLines = children.props.children.length;

  return (
    <pre
      className="grid grid-cols-12 p-4 pl-0"
      style={{ backgroundColor: "#2f323e", color: "#76d9e6" }}>
      <code className="grid col-start-1 col-end-1">
        {[0, 1].map((lineNumber) => (
          <span key={"line_" + lineNumber}>{lineNumber}</span>
        ))}
      </code>
      {children}
    </pre>
  );
}

interface IDiffCellProps {
  codeBlock: string;
  getLineColor(lineNumber: number, codeBlock: string): string | undefined;
}

function DiffCell({ codeBlock, getLineColor }: IDiffCellProps) {
  return (
    <SyntaxHighlighter
      language={"python"}
      style={colorTheme}
      useInlineStyles={true}
      // PreTag={CodeBlock}
      // codeTagProps={{
      //   className: "token string",
      //   onLoad(e) {
      //     console.log(e.target);
      //   },
      //   onClick(e) {
      //     console.log(e.target);
      //   },
      // }}
      // showLineNumbers={true}
      showLineNumbers={false}
      showInlineLineNumber={true}
      wrapLines={true}
      lineProps={(lineNumber) => {
        const backgroundColor = getLineColor(lineNumber, codeBlock);
        return {
          style: {
            backgroundColor,
            borderRadius: 2,
          },
          onClick: () => {
            console.log(lineNumber);
          },
        };
      }}
      lineNumberStyle={(lineNumber: number) => {
        const color = getLineColor(lineNumber, codeBlock);
        return {
          fontWeight: "bold",
          color: "#c0c0c050",
          backgroundColor: color,
          padding: "0 0.25rem",
          userSelect: "none",
        };
      }}>
      {codeBlock.trim()}
    </SyntaxHighlighter>
  );
}
