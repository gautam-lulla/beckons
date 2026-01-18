import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-limestone flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="body-xs text-body-75 mb-4 tracking-widest">404</p>
        <h1 className="heading-h2 mb-6">Page not found</h1>
        <p className="body-m text-body-75 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button href="/" variant="secondary">
          Return home
        </Button>
      </div>
    </main>
  );
}
