// app/components/LoginForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  authenticateUserSchema,
  AuthenticateUserSchema,
} from "@/schemas/authSchema";
import { Label, TextInput, Button } from "flowbite-react";

interface LoginFormProps {
  onSubmit: (data: AuthenticateUserSchema) => Promise<void>;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthenticateUserSchema>({
    resolver: zodResolver(authenticateUserSchema),
  });

  const handleFormSubmit = async (data: AuthenticateUserSchema) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex w-full flex-col gap-2 md:gap-4"
    >
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="username"
            value="Username"
            color={errors.username ? "failure" : undefined}
          />
        </div>
        <TextInput
          id="username"
          type="text"
          {...register("username")}
          disabled={loading}
          placeholder="Enter your username"
          color={errors.username ? "failure" : undefined}
          helperText={errors.username ? errors.username.message : null}
        />
      </div>

      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="password"
            value="Password"
            color={errors.password ? "failure" : undefined}
          />
        </div>
        <TextInput
          id="password"
          type="password"
          {...register("password")}
          disabled={loading}
          placeholder="Enter your password"
          color={errors.password ? "failure" : undefined}
          helperText={errors.password ? errors.password.message : null}
        />
      </div>

      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
};
