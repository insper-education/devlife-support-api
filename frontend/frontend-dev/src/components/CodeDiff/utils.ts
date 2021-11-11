import { Change } from "diff";
import { range } from "../../helpers";

export interface DiffBlock extends Change {
  isAdditionOnly?: boolean;
  isDeletionOnly?: boolean;
}

export type TLine =
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

export function processBlocks(diff: Change[]) {
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

  return [leftBlocks, rightBlocks];
}

export function processLines(
  leftBlocks: DiffBlock[],
  rightBlocks: DiffBlock[],
) {
  const [leftLines, rightLines] = leftBlocks.reduce(
    (accumulator, _, currentIndex) => {
      const leftBlock = leftBlocks[currentIndex];
      const rightBlock = rightBlocks[currentIndex];

      const [leftLines, rightLines] = accumulator;

      const newLeftLines = leftBlock.value
        .replace(/\n$/, "")
        .split("\n")
        .map<TLine>((line, idx) => ({
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
        .map<TLine>((line, idx) => ({
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

      const generatePadding = (): TLine => ({ isPadding: true });

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
    [[] as TLine[], [] as TLine[]],
  );

  return [leftLines, rightLines];
}
