import { Center, Box, Stack } from "@chakra-ui/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
  <html>
  <body>
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
  </body>
  <style jsx>{`
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    display: flex;
    flex-direction: column;
  }

  .wrapper {
    flex: 1;
  }

  footer {
    /* Footer styles */
    flex-shrink: 0;
    /* Set height for your footer (e.g., height: 100px;) */
  }
  `}</style>
  </html>
  );
}
