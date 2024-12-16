import { Alert } from "flowbite-react";
import { SignIn } from "./SignIn";
import { getUsers } from "@/app/actions/getUsers";

const ENABLE_DEMO = true;

const SignInPage = async () => {
  const users = ENABLE_DEMO ? await getUsers() : [];
  return (
    <SignIn>
      {ENABLE_DEMO && (
        <Alert color="success">
          <span className="font-medium">Users demo</span>
          {users.map((user) => (
            <p>
              <span className="mr-5">{user.email}</span>
              <span className="ml-auto">
                password: {user.role === "Admin" ? "admin" : "user"}
              </span>
            </p>
          ))}
        </Alert>
      )}
    </SignIn>
  );
};

export default SignInPage;
