import { supabaseLogout } from "@/hooks/supabase/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box } from "@chakra-ui/react";

export default function Logout() {
  supabaseLogout();
  return (
    <div>
      <Header />
      <div className="wrapper">
        <Box as="main" maxW="5xl" px={{ base: "4", lg: "8" }} py={{ base: "4", lg: "8" }} mb={"30%"} >
            <h3 style={{ fontSize: "2rem", fontWeight: "heavy" }}>ログアウトしました</h3>
        </Box>
      </div>
      <Footer />
    </div>
  );
}
