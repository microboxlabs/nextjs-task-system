
import { signIn } from "@/utils/auth";
import { Button, Label, TextInput, Card, HR } from "flowbite-react";
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect";

export default function LoginPage({ searchParams }: { searchParams?: Record<string, string> }) {
    const error = searchParams?.error;

    const conectar = async () => {
        "use server"
        await signIn("github")
    }

    const conectarCustom = async (formData: any) => {
        "use server"
        try {
            const user = await signIn("credentials", formData);
            if (!user) {
                console.log('Error al intentar autenticar al usuario');
                return redirect(`/auth/login?error=invalid_credentials`);
            }
        } catch (error) {
            //Esto resulve error "digest: 'NEXT_REDIRECT..." 
            //https://github.com/nextauthjs/next-auth/discussions/9389
            if (isRedirectError(error)) {
                throw error;
            }
            if (error instanceof AuthError) {
                console.log('Error while trying to log in')
                return redirect(`/auth/login?error=${error.type}`)
            }
        }
    }

    return (
        <div className="flex flex-col justify-center items-center mt-36 mx-3">
            <Card className="w-full max-w-md">
                <h1 className="dark:text-white font-medium text-2xl text-center ">Sign In</h1>
                <form action={conectarCustom} className="flex flex-col gap-4 pt-3">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email" value="Your email" />
                        </div>
                        <TextInput id="email" name="email" type="email" placeholder="test@example.com" autoComplete="false" required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Your password" />
                        </div>
                        <TextInput id="password" name="password" type="password" placeholder="password" required />
                    </div>
                    <p className={`text-red-700 ${!error && 'hidden'}`}>
                        {error === "credentials"
                            ? "Email or Password incorrect"
                            : "Somthing was wrong with"}
                    </p>
                    <Button className="mt-3" type="submit">Submit</Button>
                </form>
                <HR.Text text="or" className="custom-hr my-[15px] w-full" />
                <form action={conectar} className="w-full max-w-md pb-3">
                    <Button type="submit" color="dark" className="w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} className="mr-3" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path></svg>
                        <span className="mt-0.5">Signin with GitHub</span>
                    </Button>
                </form>
            </Card>
        </div>
    );
}
