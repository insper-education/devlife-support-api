import { render, screen, cleanup } from "@testing-library/react";
import SubTitle from ".";

describe("SubTitle", () => {
  it("shows subtitle text", () => {
    const titleTexts = ["Awesome Title", "Other Text", "Final Title"];
    for (let titleText of titleTexts) {
      render(<SubTitle>{titleText}</SubTitle>);
      expect(screen.getByText(titleText)).toBeInTheDocument();
      cleanup();
    }
  });
});
