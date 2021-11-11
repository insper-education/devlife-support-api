import { useToggle } from "../../hooks/useToggle";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ILineProps } from "./typeDefinitions";
import colorTheme from "./colorTheme";

export function Line({ line, language }: ILineProps) {
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
          language={language}
          style={colorTheme}
          PreTag={({ children }: any) => <span>{children}</span>}
          useInlineStyles={true}>
          {line.value}
        </SyntaxHighlighter>
      </span>
    </div>
  );
}

export function PaddingLine() {
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
