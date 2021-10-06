import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "../../../test-utils/mock-i18next";

import PasswordChangeForm from ".";

describe("Password change form", () => {
  it("shows reset button if not first time", async () => {
    render(<PasswordChangeForm uid="asd" token="qwe" firstTime={false} />);
    expect(
      screen.queryByRole("button", {
        name: "Reset password",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Set password",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows set button if first time", async () => {
    render(<PasswordChangeForm uid="asd" token="qwe" firstTime={true} />);
    expect(
      screen.queryByRole("button", {
        name: "Reset password",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Set password",
      }),
    ).toBeInTheDocument();
  });
});
