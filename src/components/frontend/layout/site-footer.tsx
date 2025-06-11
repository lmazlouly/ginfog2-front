import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/80">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 px-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Powered by</span>
            <span className="font-semibold">EcoSys Research</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-end">
          <nav className="flex gap-4">
            <Link
              href="#"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Help
            </Link>
          </nav>
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Teacher as Researcher. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
