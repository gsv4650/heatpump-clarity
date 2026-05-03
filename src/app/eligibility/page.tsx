"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  HomeType,
  Utility,
  ProjectType,
  EquipmentType,
} from "@/lib/calculator";

const TOTAL_STEPS = 6;

export default function EligibilityPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [homeType, setHomeType] = useState<HomeType | "">("");
  const [utility, setUtility] = useState<Utility | "">("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [equipmentType, setEquipmentType] = useState<EquipmentType | "">("");

  // Conditional question state — null = not yet answered
  const [willDecommission, setWillDecommission] = useState<boolean | null>(null);
  const [hasIntegratedControls, setHasIntegratedControls] = useState<boolean | null>(null);
  const [coversAllUnits, setCoversAllUnits] = useState<boolean | null>(null);

  const [sqft, setSqft] = useState("");
  const [isDac, setIsDac] = useState(false);

  // Determine which conditional questions apply in step 5
  const showDecommission =
    equipmentType === "ashp_ducted" || equipmentType === "ashp_ductless";

  const showIntegratedControls =
    (equipmentType === "ashp_ducted" || equipmentType === "ashp_ductless") &&
    utility === "con_edison" &&
    willDecommission === false;

  const showCoversAllUnits =
    equipmentType === "gshp" && utility === "con_edison";

  const noConditionalQuestions =
    !showDecommission && !showIntegratedControls && !showCoversAllUnits;

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return homeType !== "";
      case 2: return utility !== "";
      case 3: return projectType !== "";
      case 4: return equipmentType !== "";
      case 5: {
        if (noConditionalQuestions) return true;
        if (showDecommission && willDecommission === null) return false;
        if (showIntegratedControls && hasIntegratedControls === null) return false;
        if (showCoversAllUnits && coversAllUnits === null) return false;
        return true;
      }
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 5) {
      // Step 5 complete: if no conditional questions, skip straight to redirect
      // Otherwise validate and redirect
      const params = new URLSearchParams({
        homeType: homeType as string,
        utility: utility as string,
        projectType: projectType as string,
        equipmentType: equipmentType as string,
        willDecommission: (willDecommission ?? false).toString(),
        hasIntegratedControls: (hasIntegratedControls ?? false).toString(),
        coversAllUnits: (coversAllUnits ?? false).toString(),
        isDac: isDac.toString(),
      });
      if (sqft) params.set("sqft", sqft);
      router.push(`/estimate?${params.toString()}`);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const homeTypeOptions: { value: HomeType; label: string }[] = [
    { value: "single_family", label: "Single Family" },
    { value: "multi_family_2_4", label: "2-4 Unit Multi-Family" },
    { value: "condo", label: "Condo / Co-op" },
  ];

  const utilityOptions: { value: Utility; label: string }[] = [
    { value: "central_hudson", label: "Central Hudson" },
    { value: "con_edison", label: "Con Edison" },
    { value: "national_grid", label: "National Grid" },
    { value: "nyseg", label: "NYSEG" },
    { value: "rge", label: "RG&E" },
    { value: "orange_rockland", label: "Orange & Rockland" },
  ];

  const allEquipmentOptions: { value: EquipmentType; label: string; helper: string }[] = [
    {
      value: "ashp_ducted",
      label: "Air Source Heat Pump (Ducted)",
      helper: "Uses your existing ductwork",
    },
    {
      value: "ashp_ductless",
      label: "Air Source Heat Pump (Ductless / Mini-Split)",
      helper: "Wall-mounted units, no ductwork needed",
    },
    {
      value: "gshp",
      label: "Ground Source Heat Pump",
      helper: "Uses underground loops — most efficient but higher upfront cost",
    },
    {
      value: "hpwh",
      label: "Heat Pump Water Heater",
      helper: "Replaces your existing water heater",
    },
  ];

  const visibleEquipmentOptions =
    projectType === "new_construction"
      ? allEquipmentOptions.filter(
          (opt) => opt.value !== "ashp_ducted" && opt.value !== "ashp_ductless"
        )
      : allEquipmentOptions;

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Check Your Eligibility
        </h1>
        <p className="text-gray-600 mb-6">
          Answer a few questions to see what NYS Clean Heat incentives you may
          qualify for.
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Step {step} of {TOTAL_STEPS - 1}</span>
            <span>{Math.round((step / (TOTAL_STEPS - 1)) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-[#2563eb] transition-all duration-300"
              style={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {step === 1 && "What type of home is this for?"}
              {step === 2 && "Who is your electric utility?"}
              {step === 3 && "Is this new construction or an existing home?"}
              {step === 4 && "What type of equipment are you considering?"}
              {step === 5 && "A few more details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Home Type */}
            {step === 1 && (
              <div className="space-y-3">
                {homeTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setHomeType(opt.value)}
                    className={`w-full text-left rounded-lg border-2 p-4 transition-colors ${
                      homeType === opt.value
                        ? "border-[#2563eb] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium text-gray-900">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Utility */}
            {step === 2 && (
              <div>
                <Label className="text-sm text-gray-500 mb-2 block">
                  Select the utility company on your electric bill
                </Label>
                <Select
                  value={utility}
                  onValueChange={(v) => setUtility(v as Utility)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your utility..." />
                  </SelectTrigger>
                  <SelectContent>
                    {utilityOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 3: Project Type */}
            {step === 3 && (
              <div className="space-y-3">
                <button
                  onClick={() => setProjectType("new_construction")}
                  className={`w-full text-left rounded-lg border-2 p-4 transition-colors ${
                    projectType === "new_construction"
                      ? "border-[#2563eb] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium text-gray-900">
                    New Construction
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Building a new home or major addition
                  </p>
                </button>
                <button
                  onClick={() => setProjectType("retrofit")}
                  className={`w-full text-left rounded-lg border-2 p-4 transition-colors ${
                    projectType === "retrofit"
                      ? "border-[#2563eb] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium text-gray-900">
                    Existing Home (Retrofit)
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Upgrading the heating system in an existing home
                  </p>
                </button>
              </div>
            )}

            {/* Step 4: Equipment Type */}
            {step === 4 && (
              <div className="space-y-3">
                {projectType === "new_construction" && (
                  <Alert className="bg-amber-50 border-amber-200 mb-2">
                    <AlertDescription className="text-amber-800 text-sm">
                      ASHP systems (ducted and ductless) are not eligible for new construction
                      under the NYS Clean Heat program. Heat pumps for new builds are limited
                      to ground-source (GSHP) systems and heat pump water heaters.
                    </AlertDescription>
                  </Alert>
                )}
                <p className="text-sm text-gray-500">
                  Not sure? Most homes use ducted or ductless air source heat pumps.
                </p>
                {visibleEquipmentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setEquipmentType(opt.value)}
                    className={`w-full text-left rounded-lg border-2 p-4 transition-colors ${
                      equipmentType === opt.value
                        ? "border-[#2563eb] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium text-gray-900">
                      {opt.label}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{opt.helper}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 5: Conditional Questions + Details */}
            {step === 5 && (
              <div className="space-y-6">
                {/* Decommission question */}
                {showDecommission && (
                  <div>
                    <Label className="font-medium text-gray-900 block mb-2">
                      Are you removing your existing fossil-fuel heating system entirely?
                    </Label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setWillDecommission(true)}
                        className={`w-full text-left rounded-lg border-2 p-3 transition-colors ${
                          willDecommission === true
                            ? "border-[#2563eb] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        Yes, full removal
                      </button>
                      <button
                        onClick={() => {
                          setWillDecommission(false);
                          // Reset integrated controls when decommission changes
                          setHasIntegratedControls(null);
                        }}
                        className={`w-full text-left rounded-lg border-2 p-3 transition-colors ${
                          willDecommission === false
                            ? "border-[#2563eb] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        No, keeping it as backup
                      </button>
                    </div>
                  </div>
                )}

                {/* Integrated controls question (Con Edison only, no decommission) */}
                {showIntegratedControls && (
                  <div>
                    <Label className="font-medium text-gray-900 block mb-2">
                      Will the system include integrated controls that coordinate the heat pump
                      with your existing heating system?
                    </Label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setHasIntegratedControls(true)}
                        className={`w-full text-left rounded-lg border-2 p-3 transition-colors ${
                          hasIntegratedControls === true
                            ? "border-[#2563eb] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setHasIntegratedControls(false)}
                        className={`w-full text-left rounded-lg border-2 p-3 transition-colors ${
                          hasIntegratedControls === false
                            ? "border-[#2563eb] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        No
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Required for Con Edison Category 2a eligibility.
                    </p>
                  </div>
                )}

                {/* Covers-all-units question (Con Edison GSHP only) */}
                {showCoversAllUnits && (
                  <div>
                    <Label className="font-medium text-gray-900 block mb-2">
                      Will this GSHP system serve all units in the building?
                    </Label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setCoversAllUnits(true)}
                        className={`w-full text-left rounded-lg border-2 p-3 transition-colors ${
                          coversAllUnits === true
                            ? "border-[#2563eb] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        Yes, all units
                      </button>
                      <button
                        onClick={() => setCoversAllUnits(false)}
                        className={`w-full text-left rounded-lg border-2 p-3 transition-colors ${
                          coversAllUnits === false
                            ? "border-[#2563eb] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        No, partial coverage
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Con Edison&apos;s GSHP incentive requires whole-building coverage.
                    </p>
                  </div>
                )}

                {/* sqft input */}
                <div>
                  <Label htmlFor="sqft" className="font-medium text-gray-900">
                    Approximate home size (sq ft)
                  </Label>
                  <p className="text-sm text-gray-500 mt-1 mb-2">
                    Optional — helps estimate system size
                  </p>
                  <Input
                    id="sqft"
                    type="number"
                    placeholder="e.g., 2000"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    className="max-w-xs"
                  />
                </div>

                {/* DAC toggle */}
                <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                  <Switch
                    id="dac"
                    checked={isDac}
                    onCheckedChange={setIsDac}
                  />
                  <div>
                    <Label htmlFor="dac" className="font-medium text-gray-900 cursor-pointer">
                      Disadvantaged Community (DAC)
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Check if your address is in a NYS Disadvantaged Community.
                      This may qualify you for enhanced incentives.
                    </p>
                    <a
                      href="https://climate.ny.gov/resources/disadvantaged-communities-criteria/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#2563eb] hover:underline mt-1 inline-block"
                    >
                      Look up your address →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="border-gray-300"
                >
                  Back
                </Button>
              ) : (
                <div />
              )}
              <Button
                onClick={handleNext}
                disabled={!canAdvance()}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
              >
                {step === 5 ? "See My Estimate" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
