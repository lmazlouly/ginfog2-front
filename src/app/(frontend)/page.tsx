import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EcoSys",
  description: "Explore evidence-based teaching strategies for your classroom",
};

export default function HomePage() {
  return (
    <main className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to EcoSys Research</h1>
      <p className="mb-6 text-lg">
        Discover evidence-based teaching strategies to enhance your classroom.
      </p>
      <Link
        href="/strategies"
        className="px-6 py-3 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Explore Strategies
      </Link>
    </main>
  );
}
