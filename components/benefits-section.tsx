import { ShieldCheck, DollarSign, Clock } from "lucide-react"

export function BenefitsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="flex items-start space-x-4">
        <div className="benefit-icon">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Compare top car brands</h3>
          <p className="text-gray-600">
            Find all the leading car rental brands in one place to bring you our best prices
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="benefit-icon">
          <DollarSign className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Transparent pricing</h3>
          <p className="text-gray-600">Clear, detailed quotes with no hidden fees for peace of mind</p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="benefit-icon">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Free cancellation</h3>
          <p className="text-gray-600">Up to 48 hours before pick-up for most bookings</p>
        </div>
      </div>
    </div>
  )
}
