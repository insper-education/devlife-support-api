import { render, screen, cleanup } from "@testing-library/react";
import { ReactNode } from "react";
import { Table } from ".";

describe("Table Component", () => {
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
  const dataWithMissingValues: Record<string, ReactNode>[] = [
    { h1: "cell 00", h2: "cell 10", h3: "cell 20", hn: "cell n0" },
    { h1: "cell 01", h2: undefined, h3: "cell 21", hn: null },
    { h1: "cell 02", h2: "cell 12", h3: undefined, hn: "cell n2" },
  ];

  describe("header is provided", () => {
    it("data has no missing values", () => {
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

    it("data has some missing values", () => {
      render(<Table data={dataWithMissingValues} header={header} />);
      expect(screen.getAllByText("null")).toHaveLength(2);

      cleanup();
    });
  });

  describe("only data is provided", () => {
    it("data has no missing values", () => {
      render(<Table data={data} />);

      data.forEach((row) => {
        Object.values(row).forEach((label) => {
          expect(screen.getByText(label)).toBeInTheDocument();
        });
      });

      cleanup();
    });

    it("data has some missing values", () => {
      render(<Table data={dataWithMissingValues} />);
      expect(screen.getAllByText("null")).toHaveLength(3);

      cleanup();
    });
  });
});
