import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/core";
import React from "react";
import theme from "../theme";

function MyApp({ Component, pageProps }) {
  return (
    // <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    // </Provider>
  );
}

export default MyApp;
