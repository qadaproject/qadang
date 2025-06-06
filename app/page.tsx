import SearchForm from "@/components/SearchForm"

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Car Rental</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover amazing deals on car rentals across Nigeria
            </p>
          </div>

          {/* Search Form - Remove extra margin/padding */}
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>
    </main>
  )
}
