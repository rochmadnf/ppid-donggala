import ConsoleLayout from "@/layouts/console-layout";
import type { ReactNode } from "react";

export default function PublicOfficerIndexPage() {
    return (
        <div>Pejabat Publik</div>
    )
}

PublicOfficerIndexPage.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;