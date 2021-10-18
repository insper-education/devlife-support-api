import { render, screen, cleanup } from "@testing-library/react";
import { ReactNode } from "react";
import { Table } from ".";

describe("Table Component", () => {
  describe("rows and columns are rendered when", () => {
    const header = {
      h1: "Column 1",
      h2: "Column 2",
      hn: "Column n",
    };

    const data: Record<string, string>[] = [
      { h1: "cell 00", h2: "cell 10", h3: "cell 20", hn: "cell n0" },
      { h1: "cell 01", h2: "cell 11", h3: "cell 21", hn: "cell n1" },
      { h1: "cell 02", h2: "cell 12", h3: "cell 22", hn: "cell n2" },
    ];

    it("has header and data provided", () => {
      render(<Table header={header} data={data} />);
      for (let label of Object.values(header)) {
        expect(screen.getByText(label)).toBeInTheDocument();
        data.forEach((row) => {
          Object.keys(header).forEach((key) => {
            expect(screen.getByText(row[key])).toBeInTheDocument();
          });
        });
      }

      data.forEach((row) => {
        expect(screen.queryByText(row.h3)).toBeNull();
      });
      cleanup();
    });

    it("has data provided but header is missing", () => {
      render(<Table data={data} />);

      data.forEach((row) => {
        Object.values(row).forEach((label) => {
          expect(screen.getByText(label)).toBeInTheDocument();
        });
      });

      cleanup();
    });
  });

  describe("rows and columns are rendered", () => {
    it("has some missing data values", () => {
      const data: Record<string, ReactNode>[] = [
        { h1: "cell 00", h2: "cell 10", h3: "cell 20", hn: "cell n0" },
        { h1: "cell 01", h2: undefined, h3: "cell 21", hn: null },
        { h1: "cell 02", h2: "cell 12", h3: undefined, hn: "cell n2" },
      ];

      const missingValuesCount = data.reduce((accumulator, currentElement) => {
        let nullishValues = 0;
        for (let value of Object.values(currentElement)) {
          if (value === null || value === undefined) {
            nullishValues++;
          }
        }
        return accumulator + nullishValues;
      }, 0);

      render(<Table data={data} />);
      expect(screen.getAllByText("null")).toHaveLength(missingValuesCount);

      cleanup();
    });
  });
});
