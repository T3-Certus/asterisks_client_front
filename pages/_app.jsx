import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AuthContext } from "../utils";
import { CookiesProvider } from "react-cookie";

function Loading() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => url !== router.asPath && setLoading(true);
    const handleComplete = () =>
      setTimeout(() => {
        setLoading(false);
        router.reload();
      }, 500);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });
  return (
    loading && (
      <div className="fixed z-50 flex flex-col items-center justify-center w-full h-screen bg-ivory">
        <p className="text-5xl font-Pacifico text-charleston">Asterisks...</p>
      </div>
    )
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AuthContext>
      <CookiesProvider>
        <Loading />
        <Component {...pageProps} />
      </CookiesProvider>
    </AuthContext>
  );
}

export default MyApp;
