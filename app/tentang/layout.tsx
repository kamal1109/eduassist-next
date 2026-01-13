import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tentang Kami - EduAssist",
    description: "Kenali lebih dekat layanan responden dan olah data nomor 1 di Indonesia.",
};

export default function TentangLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}