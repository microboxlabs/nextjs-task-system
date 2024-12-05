"use client";
import { loginUser } from "@/actions/authentication/login-actions";
import { Card, Label, TextInput, Button, Alert } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResponseLogin } from "@/types/login-types";

export default function LoginCard() {
  const router = useRouter();
  const [loginToast, setLoginToast] = useState<{
    showToast: boolean;
    messageToast?: string;
  }>({ showToast: false, messageToast: "" });

  return (
    <div className="flex-wrap">
      {loginToast.showToast && (
        <Alert color="failure" className="mb-5">
          <span className="font-medium text-red-500">
            {loginToast.messageToast}
          </span>
        </Alert>
      )}
      <Card className="w-full min-w-[400px] md:w-full">
        <form
          className="flex h-full flex-col gap-6 "
          action={async (formData) => {
            const response: ResponseLogin = await loginUser(formData);
            if (response.status !== 200) {
              setLoginToast({
                showToast: true,
                messageToast:
                  "Error: Incorrect email or password. Please try again",
              });
            } else {
              router.push("/home");
            }
          }}
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your email" />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="name@flowbite.com"
              name="email"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput
              id="password"
              type="password"
              name="password"
              required
              autoComplete="true"
            />
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Card>
    </div>
  );
}
