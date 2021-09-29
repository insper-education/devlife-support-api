import { render, screen, cleanup } from "@testing-library/react";
import Separator from ".";

describe("Separator", () => {
  it("shows separator text", () => {
    const separatorTexts = ["Awesome Title", "Other Text", "Final Title"];
    for (let separatorText of separatorTexts) {
      render(<Separator>{separatorText}</Separator>);
      expect(screen.getByText(separatorText)).toBeInTheDocument();
      cleanup();
    }
  });
});
