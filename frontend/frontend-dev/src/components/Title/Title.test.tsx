import { render, screen, cleanup } from "@testing-library/react";
import Title from ".";

describe("Title", () => {
  it("shows title text", () => {
    const titleTexts = ["Awesome Title", "Other Text", "Final Title"];
    for (let titleText of titleTexts) {
      render(<Title>{titleText}</Title>);
      expect(screen.getByText(titleText)).toBeInTheDocument();
      cleanup();
    }
  });
});
