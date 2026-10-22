"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { SidebarContent } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeMobileNav } from "@/store/uiSlice";

export function AppShell({ children }: { children: React.ReactNode }) {
  const mobileNavOpen = useAppSelector((s) => s.ui.mobileNavOpen);
  const dispatch = useAppDispatch();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-surface md:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
              onClick={() => dispatch(closeMobileNav())}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-40 w-72 bg-surface shadow-xl md:hidden"
            >
              <button
                type="button"
                onClick={() => dispatch(closeMobileNav())}
                className="absolute right-3 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-surface-muted"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
              <SidebarContent onNavigate={() => dispatch(closeMobileNav())} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
