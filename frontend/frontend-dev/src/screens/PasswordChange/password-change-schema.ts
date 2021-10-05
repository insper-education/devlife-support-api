import * as yup from "yup";

export interface PasswordChangeInputs {
  password: string;
  passwordConfirmation: string;
}

export const schema = yup.object().shape({
  password: yup.string().required(),
  passwordConfirmation: yup
    .string()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});
