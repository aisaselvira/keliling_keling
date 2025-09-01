import { Bounce, ToastContainer } from "react-toastify";
import "./globals.css";
import SiteShell from "@/app/components/Layout/SiteShell";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: any;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      {/* <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick={true}
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
  transition={Bounce}
/> */}
        <SiteShell session={session}>          
          {children}
         </SiteShell>
      </body>
    </html>
  );
}
