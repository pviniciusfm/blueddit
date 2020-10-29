import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  const errors = [];
  if (!options.email.includes("@")) {
    errors.push({
      field: "email",
      message: "email must be a valid email",
    });
  }

  if (options.username.length < 2) {
    errors.push({
      field: "username",
      message: "username must be greater than 2 characters",
    });
  }

  if (options.password.length < 2) {
    errors.push({
      field: "password",
      message: "password must be greater than 2 characters",
    });
  }

  if (options.username.includes('@')){
    errors.push({
      field: "username",
      message: "username can't have '@' character",
    });
  }

  return errors
};
