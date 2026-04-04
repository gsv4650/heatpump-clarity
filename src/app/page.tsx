import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SAMPLE_MANUAL_UPDATES } from "@/lib/data";

const benefits = [
  {
    title: "See Your Savings",
    description:
      "Get an instant incentive estimate based on your utility and project type.",
    icon: "💲",
  },
  {
    title: "Plain English",
    description:
      "No confusing program codes or utility jargon — just clear answers.",
    icon: "📝",
  },
  {
    title: "Document Checklist",
    description:
      "Know exactly what paperwork you need before you start.",
    icon: "📋",
  },
  {
    title: "Always Current",
    description:
      "Incentive tables updated as programs change so you never miss out.",
    icon: "🔄",
  },
];

const utilities = [
  "Central Hudson",
  "Con Edison",
  "National Grid",
  "NYSEG",
  "RG&E",
  "Orange & Rockland",
];

export default function HomePage() {
  const publishedUpdates = SAMPLE_MANUAL_UPDATES.filter((u) => u.published);

  return (
    <div className="flex flex-col">
      {/* Recent Updates Banner */}
      {publishedUpdates.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Latest:</span>{" "}
              {publishedUpdates[0].title}
            </p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Find Out What Heat Pump Incentives You Qualify For
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Navigate NYS Clean Heat incentives the easy way — plain English, no
            jargon.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/eligibility"
              className="inline-flex items-center justify-center rounded-lg h-12 px-8 text-lg font-medium bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition-colors"
            >
              Check My Eligibility
            </Link>
            <Link
              href="/contractor"
              className="inline-flex items-center justify-center rounded-lg h-12 px-8 text-lg font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 transition-colors"
            >
              Contractor Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 px-4 sm:px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            How HeatPumpClarity Helps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <Card key={b.title} className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-3">{b.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-gray-600 text-sm">{b.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Utility Coverage */}
      <section className="py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Supported Utilities
          </h2>
          <p className="text-gray-600 mb-8">
            We cover all major NYS electric utilities participating in Clean
            Heat.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {utilities.map((name) => (
              <div
                key={name}
                className="rounded-lg border border-gray-200 bg-white p-4 text-center font-medium text-gray-700 text-sm"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-800 text-sm">
              <strong>Disclaimer:</strong> Incentive amounts shown are
              estimates. Final eligibility and amounts depend on current program
              rules and utility requirements. Always confirm with your
              contractor and NYSERDA before making purchasing decisions.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </div>
  );
}
