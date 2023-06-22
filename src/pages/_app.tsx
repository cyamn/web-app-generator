import "@/styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/utils/api";
config.autoAddCss = false;

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProperties },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProperties} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
export { reportWebVitals } from "next-axiom";
