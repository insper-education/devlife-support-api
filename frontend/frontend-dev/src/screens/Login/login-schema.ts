import * as yup from "yup";

export interface LoginInputs {
  username: string;
  password: string;
}

export const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});
