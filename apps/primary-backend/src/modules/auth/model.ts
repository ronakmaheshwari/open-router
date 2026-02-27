import { t, UnwrapSchema } from "elysia";

const AuthModel = {
  signUpBody: t.Object(
    {
      name: t.String({
        minLength: 3,
        maxLength: 20,
        error: "Name must be between 3 and 20 characters",
      }),

      email: t.String({
        format: "email",
        error: "Please provide a valid email address",
      }),

      password: t.String({
        minLength: 6,
        maxLength: 64,
        pattern: '/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/',
        error:
          "Password must be at least 6 characters long and include uppercase, lowercase, and a number",
      }),
    },
    { additionalProperties: false }
  ),

  signUpResponse: t.Object({
    message: t.String(),
    token: t.String(),
  }),

  signUpInvalid: t.Literal("Invalid name,email or password"),

  signInBody: t.Object(
    {
        email: t.String({
            format: "email",
            error: "Please provide a valid email address",
        }),
        password: t.String({
            minLength: 6,
            maxLength: 64,
            pattern: '/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/',
            error:
            "Password must be at least 6 characters long and include uppercase, lowercase, and a number",
        }),
    },
    { additionalProperties: false }
  ),

  signInResponse: t.Object({
    message: t.String(),
    token: t.String()
  }),

  signInInvalid: t.Literal("Invalid email or password")

} as const;

export type AuthModel = {
  [K in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[K]>;
};

export default AuthModel;