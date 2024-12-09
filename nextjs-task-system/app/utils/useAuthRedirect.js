import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export function useAuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");

        if (!token) {
            router.push("/pages/Login");
        }
    }, []);
}
