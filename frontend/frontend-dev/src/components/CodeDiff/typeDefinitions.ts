import { Change } from "diff";

export interface ICodeDiffProps {
  left: string;
  right: string;
  leftTitle?: string;
  rightTitle?: string;
  language?: "python" | "css" | "javascript";
  title?: number;
}

export interface DiffBlock extends Change {
  isAdditionOnly?: boolean;
  isDeletionOnly?: boolean;
}

export interface ICodeBlockProps {
  lines: TLine[];
  language: string;
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

export interface ILineProps {
  line: TLine;
  language: string;
}
