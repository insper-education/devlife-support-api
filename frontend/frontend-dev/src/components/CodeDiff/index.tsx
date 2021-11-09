import { ReactNode, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import colorTheme from "./colorTheme";
import { diffLines } from "diff";
import { spawn } from "child_process";

interface ICodeDiffProps {
  oldValue: string;
  newValue: string;
  leftTitle?: string;
  rightTitle?: string;
}

const before = `
conf = input('Você tem dúvidas? (S/N)')
while conf != 'N':
print('Pratique mais')
if conf == 'N':
    print('Até a próxima')
    `;

const after = `
    conf = input('Você ainda tem dúvidas? ')
    while conf != 'não':
    print('Pratique mais')
    conf = input('Você ainda tem dúvidas? ')
    if conf == 'não':
    print('Até a próxima')
    `;

export function CodeDiff({
  oldValue,
  newValue,
  leftTitle,
  rightTitle,
}: ICodeDiffProps) {
  const { left, right } = useMemo(() => {
    const diff = diffLines(before?.trim(), after?.trim(), {
      ignoreCase: false,
      ignoreWhitespace: false,
      newlineIsToken: false,
    });

    const [left, right] = diff
      // .filter(({ added }) => !added)
      .map(({ value, removed, added }) => {
        const token = removed ? "- " : added ? "+ " : "  ";
        return (
          "\n" +
          token +
          value
            .trimEnd()
            .split("\n")
            .join("\n" + token)
        );
      })
      .join("");
    // const right = diff
    //   .filter(({ removed }) => !removed)
    //   .map(({ value, added, removed }) => {
    //     const token = added ? "+ " : removed ? "- " : "  ";
    //     return (
    //       "\n" +
    //       token +
    //       value
    //         .trimEnd()
    //         .split("\n")
    //         .join("\n" + token)
    //     );
    //   })
    //   .join("");
    return { left, right };
  }, [oldValue, newValue]);

  function getLineColor(lineNumber: number, code: string) {
    const idx = lineNumber - 1;
    const line = code.split("\n")[idx];
    const color = line.startsWith("+")
      ? "#20ff0050"
      : line.startsWith("-")
      ? "#ff200050"
      : undefined;
    return color;
  }

  return (
    <div className="grid grid-cols-2 justify-items-stretch gap-1 rounded overflow-hidden flex-row mt-2 lg:mt-0 compact-scrollbar">
      <DiffCell codeBlock={left} getLineColor={getLineColor} />
      <DiffCell codeBlock={right} getLineColor={getLineColor} />
      {/* <ReactDiff oldValue={oldValue} newValue={newValue} useDarkTheme={true} /> */}
    </div>
  );
}

function CodeBlock({ children }: { children: JSX.Element }) {
  const numberOfLines = children.props.children.length;

  console.log(children.props.children[1].length);

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
      {/* {"conf = input('Você tem dúvidas? (S/N)')"} */}
    </SyntaxHighlighter>
  );
}
