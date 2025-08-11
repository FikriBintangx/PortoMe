export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-6 py-4 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} CosmiCoffee. All rights reserved.</p>
      </div>
    </footer>
  );
}
