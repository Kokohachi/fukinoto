import { Center, Box, Stack } from "@chakra-ui/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
    <div className="wrapper">
      <div className="content">
      <Header />
      <Box
        as="main"
        maxW="5xl"
        px={{ base: "4", lg: "8" }}
        py={{ base: "4", lg: "8" }}
      >

          <Stack
            spacing={{ base: "4", lg: "10" }}
            maxW={{ lg: "2xl" }}
            textAlign="left"
            align="left"
          >
          <h3 style={{ fontSize: "2rem", fontWeight: "medium" }}>ふきのとうへようこそ！</h3>
          </Stack>
      </Box>
      </div>
    </div>
    <footer>
      <Footer />
    </footer>
  </div>
  );
}
