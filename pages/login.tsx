import { supabaseLogin } from "@/hooks/supabase/auth";

export default function Login() {
    supabaseLogin();
}
