import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
    </SessionContextProvider>
  );
}
