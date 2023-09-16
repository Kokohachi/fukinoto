import { SupabaseClient  } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

const supabase = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    supabase.auth.signOut().then((error) => {
        console.log(error)
        res.redirect('/')
    }
    )
}
