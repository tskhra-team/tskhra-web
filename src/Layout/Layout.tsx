import Footer from "../shared/Footer";
import Header from "../shared/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </section>
  );
}
