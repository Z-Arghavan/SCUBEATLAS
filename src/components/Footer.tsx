
export default function Footer() {
  return (
    <footer className="bg-white border-t text-center text-xs py-5 mt-10 text-gray-500">
      <div>
        © {new Date().getFullYear()} Circular Atlas • Contact for contributions.
      </div>
      <div>
        Made with <span className="text-pink-500">♥</span> | Built for learning & collaboration.
      </div>
    </footer>
  );
}
