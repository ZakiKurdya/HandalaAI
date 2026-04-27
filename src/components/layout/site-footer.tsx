"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/provider";
import { HandalaMark } from "@/components/ui/logo";

export function SiteFooter() {
  const { t } = useI18n();
  const pathname = usePathname();
  const isChat = pathname?.startsWith("/chat");
  return (
    <footer className={`${isChat ? "" : "mt-20"} border-t`}>
      <div
        aria-hidden
        className="h-5 opacity-60"
        style={{
          backgroundImage: "url('/chat-background.png')",
          backgroundSize: "320px",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-2 items-center">
        <div className="flex items-center gap-3">
          <HandalaMark className="h-10 w-10" />
          <div>
            <p className="font-semibold">{t.brand}</p>
            <p className="text-sm text-muted mt-1 max-w-xs">{t.tagline}</p>
          </div>
        </div>
        <div className="text-sm text-muted md:text-end">
          <p>© {new Date().getFullYear()} Handala</p>
        </div>
      </div>
    </footer>
  );
}
