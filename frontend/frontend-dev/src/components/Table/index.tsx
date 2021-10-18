import { memo, ReactNode } from "react";

interface ITableProps {
  header?: Record<string, string>;
  data: Record<string, ReactNode>[];
}

function UnmemoizedTable({ data, header }: ITableProps) {
  const headerLabels = header ? Object.values(header) : Object.keys(data[0]);
  const rows = header
    ? data.map((row) => Object.keys(header).map((key) => row[key]))
    : data.map((item) => Object.values(item));

  return (
    <div className="flex m-2">
      <div className="overflow-x-auto no-scrollbar max-w-full">
        <div className="align-middle inline-block">
          <div className="border-b border-gray-200 rounded-lg overflow-hidden border">
            <table className="divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headerLabels.map((cell, cellIndex) => (
                    <th key={"header__" + cellIndex} className="p-3">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-50">
                {(rows || [{}]).map((row, rowIndex) => (
                  <tr
                    key={"textAnswers__" + rowIndex}
                    className={!!(rowIndex % 2) ? "bg-gray-100" : "bg-gray-50"}>
                    {row.map((cell, columnIndex) => (
                      <td
                        key={`cell__${columnIndex}${rowIndex}`}
                        className="px-6 py-4 whitespace-nowrap">
                        {cell ?? "null"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * usage:
 * 
 * ```typescript
 * const data = [
 *   { h1: "cell 00", h2: "cell 10", h3: "cell 20" },
 *   { h1: "cell 01", h2: "cell 11", h3: "cell 21" },
 *   { h1: "cell 02", h2: "cell 12", h3: "cell 22" },
 * ]
 * ```
 *
 * ```typescriptreact
 * <Table data={data} />
 * ```
 *
 * To render:
 *
    | h1      | h2      | h3       |
    |---------|---------|----------|
    | cell 00 | cell 10 | cell 20  |
    | cell 01 | cell 11 | cell 21  |
    | cell 02 | cell 12 | cell 22  |
  *
  * 
  * Or
  * 
  * ```typescript
  * const header = {
  *   h1: "Header 1",
  *   h2: "Header 2",
  *   hx: "Header x"
  * }
  * 
  * const data = [
  *   { h1: "cell 00", h2: "cell 10", h3: "cell 20", hx: "cell x0" },
  *   { h1: "cell 01", h2: "cell 11", h3: "cell 21", hx: "cell x1" },
  *   { h1: "cell 02", h2: "cell 12", h3: "cell 22", hx: "cell x2" },
  * ]
  * ```
  * 
  * ```typescriptreact
  * <Table header={header} data={data} />
  * ```
  * 
  * To render:
  *
      | Header 1 | Header 2 | Header x |
      |----------|----------|----------|
      | cell 00  | cell 10  | cell x0  |
      | cell 01  | cell 11  | cell x1  |
      | cell 02  | cell 12  | cell x2  |
  *
  * Note that using `header` property you're able to select which
  * columns will be shown and even rename them.
  * 
 */
export const Table = memo(UnmemoizedTable);
