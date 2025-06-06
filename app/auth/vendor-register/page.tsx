"use client"

import { useState } from "react"
import { Eye, EyeOff, Car, Upload, CheckCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function VendorRegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-3xl font-bold text-blue-600">QADA.ng</span>
          </Link>
          <p className="text-gray-600 mt-2">Register as a vendor and start listing your cars</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step === currentStep
                        ? "bg-blue-600 text-white"
                        : step < currentStep
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  <span className="text-sm mt-2">
                    {step === 1 ? "Business Info" : step === 2 ? "Documents" : "Review"}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
              <div
                className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                {currentStep === 1
                  ? "Business Information"
                  : currentStep === 2
                    ? "Upload Documents"
                    : "Review & Submit"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1
                  ? "Provide details about your car rental business"
                  : currentStep === 2
                    ? "Upload required documents for verification"
                    : "Review your information before submission"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" placeholder="Enter your business name" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Business Email</Label>
                      <Input id="email" type="email" placeholder="Enter your business email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Business Phone</Label>
                      <Input id="phone" type="tel" placeholder="Enter your business phone" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input id="address" placeholder="Enter your business address" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lagos">Lagos</SelectItem>
                          <SelectItem value="abuja">Abuja</SelectItem>
                          <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                          <SelectItem value="kano">Kano</SelectItem>
                          <SelectItem value="ibadan">Ibadan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select>
                      <SelectTrigger id="businessType">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="registered-business">Registered Business</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your car rental business"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Create Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters long with a number and a special character
                    </p>
                  </div>
                </form>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <Label className="block mb-2">Business Registration Certificate (CAC)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">Drag and drop your CAC document or click to browse</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Upload File
                        </Button>
                        <p className="mt-2 text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max size: 5MB)</p>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <Label className="block mb-2">Identification Document</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Upload a valid ID (National ID, Driver's License, or International Passport)
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Upload File
                        </Button>
                        <p className="mt-2 text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max size: 5MB)</p>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <Label className="block mb-2">Proof of Address</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Upload a utility bill or bank statement (not older than 3 months)
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Upload File
                        </Button>
                        <p className="mt-2 text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max size: 5MB)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-medium text-yellow-800">Document Verification</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      All documents will be verified by our team. This process typically takes 1-2 business days.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800">Almost Done!</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Please review your information before submitting your application.
                    </p>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="business-info">
                      <AccordionTrigger>Business Information</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Business Name:</span>
                            <span className="font-medium">Lagos Car Rentals</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">info@lagoscarrentals.com</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium">+234 803 123 4567</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Address:</span>
                            <span className="font-medium">123 Marina Street, Lagos Island</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">City:</span>
                            <span className="font-medium">Lagos</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Business Type:</span>
                            <span className="font-medium">Registered Business</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="documents">
                      <AccordionTrigger>Uploaded Documents</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Business Registration:</span>
                            <span className="font-medium">CAC_Certificate.pdf</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Identification:</span>
                            <span className="font-medium">ID_Document.pdf</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Proof of Address:</span>
                            <span className="font-medium">Utility_Bill.pdf</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="accurate" required />
                      <Label htmlFor="accurate" className="text-sm">
                        I confirm that all information provided is accurate and complete
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Continue
                  </Button>
                ) : (
                  <Button type="submit">Submit Application</Button>
                )}
              </div>

              {currentStep === 1 && (
                <p className="text-center text-sm text-gray-600 mt-6">
                  Already have a vendor account?{" "}
                  <Link href="/auth/login?tab=vendor" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
