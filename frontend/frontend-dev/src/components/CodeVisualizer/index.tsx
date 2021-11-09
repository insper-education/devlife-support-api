import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import colorTheme from "./colorTheme";

interface ICodeVisualizerProps {
  children: string;
  language?: "python" | "css" | "javascript";
  className?: string;
}
export function CodeVisualizer({
  children,
  language = "python",
  className,
}: ICodeVisualizerProps) {
  return (
    <div className={`compact-scrollbar ${className ?? ""}`}>
      <SyntaxHighlighter
        language={language}
        style={colorTheme}
        showLineNumbers={true}
        wrapLines={false}
        lineNumberStyle={{
          fontWeight: "bold",
          color: "##555a7b",
          padding: "0.25rem 0.5rem",
          marginLeft: "-0.5rem",
          userSelect: "none",
        }}>
        {children?.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
