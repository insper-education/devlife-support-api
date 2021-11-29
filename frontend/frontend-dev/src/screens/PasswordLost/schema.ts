import * as yup from "yup";

export interface IPasswordResetInputs {
    email: string;
  }
  
  export const passwordResetSchema = yup.object().shape({
    email: yup.string().required()
  });
  