export default async function Layout({ children }: { children: React.ReactNode }) {
  return <div className="py-24 flex flex-col gap-12 items-center">{children}</div>;
}
