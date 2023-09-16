import { supabaseLogout } from "@/hooks/supabase/auth";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    await supabaseLogout();
    res.redirect("/");
    };

export default handler;