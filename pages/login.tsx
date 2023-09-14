import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/dist/server/api-utils";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {

    const router = useRouter();
    const { redirectTo } = router.query;
    const redirectURL = process.env.NEXT_PUBLIC_HOST || "" + (redirectTo ? redirectTo : "/")
    useEffect(() => {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || "",
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        );

        supabase.auth.signInWithOAuth({ provider: "discord", options:{"scopes":"identify, email, guilds", "redirectTo": redirectURL}})
        
    }
    )
}
