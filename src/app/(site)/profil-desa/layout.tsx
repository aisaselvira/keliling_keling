import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Profil Desa",
};

export default function ProfilDesaLayout({children}: {children: React.ReactNode}) {
    return <>{children}</>;
}
