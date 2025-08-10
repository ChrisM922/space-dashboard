import Link from 'next/link';

export default function Contact() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <section className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg mb-6 text-gray-300">
          Have questions, feedback, or want to contribute? Reach out to the Space Dashboard team using the form below, or connect with us on GitHub.
        </p>
        <form className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="px-4 py-2 rounded-md text-black"
            required
            aria-label="Name"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="px-4 py-2 rounded-md text-black"
            required
            aria-label="Email"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            className="px-4 py-2 rounded-md text-black"
            rows={5}
            required
            aria-label="Message"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Send Message"
          >
            Send Message
          </button>
        </form>
        <div className="mb-6">
          <p className="text-gray-300">Or connect with us on <Link href="https://github.com/ChrisM922/space-dashboard" className="text-blue-400 hover:text-blue-300 font-medium" target="_blank" rel="noopener noreferrer">GitHub</Link>.</p>
        </div>
        <footer className="mt-8 text-gray-500 text-sm">© {new Date().getFullYear()} Space Dashboard</footer>
      </section>
    </main>
  );
}
