
export default function AboutUsPage() {
  return (
    <div className="max-w-2xl mx-auto py-14 px-4 text-center">
      <h2 className="text-3xl font-bold mb-4 text-primary">About Us</h2>
      <p className="mb-5 text-gray-600">
        The Circular Atlas is a community-driven platform to collect and share serious games about circularity and sustainability in architecture and the built environment. Our goal is to inspire, educate, and accelerate the transition to a more sustainable future.
      </p>
      <p className="mb-5 text-gray-600">
        Do you build, research, or use games for circular construction or transformation? Want to join us or add your own game? <a className="text-blue-600 underline hover:text-blue-800" href="/submit">Submit a Game</a> or contact us by email!
      </p>
      <div className="mt-6 text-sm text-gray-500">This platform is open source and community governed.</div>
    </div>
  );
}
