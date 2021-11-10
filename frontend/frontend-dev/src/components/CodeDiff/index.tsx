import { useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import colorTheme from "./colorTheme";
import { diffLines, Change } from "diff";
import { range } from "../../helpers";
import { useToggle } from "../../hooks/useToggle";

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
            <Line key={"line_" + String(index) + line.lineNumber} line={line} />
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
          language={"python"}
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
