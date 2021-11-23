import { useToggle } from "../../hooks/useToggle";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ILineProps } from "./typeDefinitions";

export function Line({ line, language }: ILineProps) {
  const [selected, toggleSelect] = useToggle(false);

  const backgroundColor = line.added
    ? "bg-green-800"
    : line.removed
    ? "bg-red-900"
    : "bg-gray-900";

  const selectedBgOpacity = selected ? "bg-opacity-90" : "bg-opacity-30";

  const lineChangeType = line.added ? "+" : line.removed ? "-" : "";
  const lineDetailsColor = line.added
    ? "text-green-400"
    : line.removed
    ? "text-red-400"
    : "text-gray-400";

  return (
    <div
      onClick={toggleSelect}
      className={`flex flex-row cursor-pointer hover:bg-opacity-60 ${backgroundColor} ${selectedBgOpacity}`}>
      {line.lineNumber && (
        <span
          className={`${lineDetailsColor} bg-black-real bg-opacity-20 w-10 text-center select-none`}>
          {line.lineNumber}
        </span>
      )}

      <span
        className={`${lineDetailsColor} bg-black-real bg-opacity-10 w-5 text-center select-none`}>
        {lineChangeType}
      </span>

      <span className="px-2 pl-1">
        <SyntaxHighlighter
          language={language}
          style={{}}
          PreTag={({ children }: any) => <>{children}</>}
          useInlineStyles={false}>
          {line.value}
        </SyntaxHighlighter>
      </span>
    </div>
  );
}

export function PaddingLine({ onClick = () => {} }) {
  return (
    <div
      className="hidden sm:block sm:py-3"
      onClick={onClick}
      style={{
        background:
          "repeating-linear-gradient(135deg, #202533, #202533 8.5px, #20253350 8.5px, #20253350 17px)",
      }}
    />
  );
}
