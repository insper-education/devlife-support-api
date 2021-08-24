import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, History } from "history";
import App from ".";
import { Router } from "react-router";

export const startAt = (currentLocation: string): History => {
  const history = createMemoryHistory();
  history.push(currentLocation);
  render(
    <Router history={history}>
      <App />
    </Router>,
  );
  return history;
};

export const accessPage = (url: string, history: History) => {
  history.push(url);
};

export const fillUsername = async (username: string) => {
  const userInput = await screen.getByLabelText(/us.*r.*/i);
  userEvent.type(userInput, username);
};

export const fillPassword = async (password: string) => {
  const passwordInput = await screen.getByLabelText(/pass.*|senha/i);
  userEvent.type(passwordInput, password);
};

export const signIn = async () => {
  const submitButton = await screen.getByRole("button", {
    name: /sign.*|entrar/i,
  });

  userEvent.click(submitButton);
};
