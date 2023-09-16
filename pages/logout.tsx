import { supabaseLogout } from "@/hooks/supabase/auth";

export default function Logout() {
    supabaseLogout();
}