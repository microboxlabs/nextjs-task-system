export default function NotFound() {
  return (
    <main className="grid h-full place-content-center pt-5">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-4xl font-bold dark:text-gray-100">
          404 Not found
        </h1>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-200">
          Ups, we are still under construction
        </p>
        <a
          href="/"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Come back
        </a>
      </div>
    </main>
  );
}
