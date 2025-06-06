import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import SearchForm from "@/components/SearchForm"
import { VendorLogos } from "@/components/vendor-logos"
import { BenefitsSection } from "@/components/benefits-section"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-gradient text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Car rentals for any kind of trip</h1>
              <p className="text-xl mb-8">Great cars at great prices from the biggest rental companies</p>

              <SearchForm />
            </div>
          </div>
        </section>

        {/* Popular Rental Companies */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Popular rental car companies</h2>
            <VendorLogos />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <BenefitsSection />
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Popular destinations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Lagos", cars: "2,500+ cars" },
                { name: "Abuja", cars: "1,800+ cars" },
                { name: "Port Harcourt", cars: "900+ cars" },
                { name: "Kano", cars: "600+ cars" },
                { name: "Ibadan", cars: "750+ cars" },
                { name: "Benin City", cars: "400+ cars" },
              ].map((city, index) => (
                <a
                  key={index}
                  href={`/search?pickup_location=${encodeURIComponent(city.name)}`}
                  className="block group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-32 bg-gray-200 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white">
                        <h3 className="font-semibold">{city.name}</h3>
                        <p className="text-sm opacity-90">{city.cars}</p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">How do I find the cheapest car rental deals?</h3>
                <p className="text-gray-600">
                  To find the cheapest car rental deals, it's best to book in advance, compare prices from different
                  rental companies, and be flexible with your pickup and drop-off times.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What documents do I need to rent a car?</h3>
                <p className="text-gray-600">
                  You'll typically need a valid driver's license, a credit card in the main driver's name, and a form of
                  identification (like a passport).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I rent a car with a debit card?</h3>
                <p className="text-gray-600">
                  Some rental companies accept debit cards, but many require a credit card for the security deposit.
                  Check with the specific vendor for their policy.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Is insurance included in the rental price?</h3>
                <p className="text-gray-600">
                  Basic insurance is often included, but additional coverage options may be available. We recommend
                  checking the specific terms before booking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
