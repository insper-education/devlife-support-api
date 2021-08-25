import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import Button from ".";

describe("Button", () => {
  it("shows button label", () => {
    const labels = ["Awesome Label", "Other Text", "Final Label"];
    for (let label of labels) {
      render(<Button>{label}</Button>);
      expect(screen.getByRole("button")).toHaveTextContent(label);
      cleanup();
    }
  });

  it("calls button onClick", () => {
    const onClick = jest.fn();
    const label = "Click me!";
    render(<Button onClick={onClick}>{label}</Button>);

    const totalClicks = 5;
    for (let i = 0; i < totalClicks; i++) {
      fireEvent.click(screen.getByText(label));
    }
    expect(onClick).toHaveBeenCalledTimes(totalClicks);
  });

  it("doesn't call disabled button onClick", () => {
    const onClick = jest.fn();
    const label = "Click me!";
    render(
      <Button onClick={onClick} disabled>
        {label}
      </Button>,
    );

    const totalClicks = 5;
    for (let i = 0; i < totalClicks; i++) {
      fireEvent.click(screen.getByText(label));
    }
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
