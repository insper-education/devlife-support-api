import { memo, ReactNode } from "react";

interface ITableProps {
  data: Record<string, ReactNode>[];
}

function UnmemoizedTable({ data }: ITableProps) {
  if (!data.length) {
    return null;
  }

  const header = Object.keys(data[0]);
  const rows = data.map((item) => Object.values(item));

  return (
    <div className="flex m-2">
      <div className="overflow-x-auto no-scrollbar max-w-full">
        <div className="align-middle inline-block">
          <div className="border-b border-gray-200 rounded-lg overflow-hidden border">
            <table className="divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {header.map((cell, cellIndex) => (
                    <th key={"header__" + cellIndex} className="p-3">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-50">
                {rows.map((row, rowIndex) => (
                  <tr
                    key={"textAnswers__" + rowIndex}
                    className={!!(rowIndex % 2) ? "bg-gray-100" : "bg-gray-50"}>
                    {row.map((cell, columnIndex) => (
                      <td
                        key={`cell__${columnIndex}${rowIndex}`}
                        className="px-6 py-4 whitespace-nowrap">
                        {cell ?? ""}
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
 */
export const Table = memo(UnmemoizedTable);
