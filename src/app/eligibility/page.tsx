"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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
  WaterHeaterReplace,
} from "@/lib/calculator";

const TOTAL_STEPS = 6;

export default function EligibilityPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [homeType, setHomeType] = useState<HomeType | "">("");
  const [utility, setUtility] = useState<Utility | "">("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [equipmentType, setEquipmentType] = useState<EquipmentType | "">("");
  const [waterHeaterReplace, setWaterHeaterReplace] = useState<WaterHeaterReplace | "">("");
  const [sqft, setSqft] = useState("");
  const [isDac, setIsDac] = useState(false);

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return homeType !== "";
      case 2: return utility !== "";
      case 3: return projectType !== "";
      case 4: return equipmentType !== "";
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 5) {
      // Build query params and redirect to estimate
      const params = new URLSearchParams({
        homeType: homeType as string,
        utility: utility as string,
        projectType: projectType as string,
        equipmentType: equipmentType as string,
        isDac: isDac.toString(),
      });
      if (waterHeaterReplace) params.set("waterHeaterReplace", waterHeaterReplace);
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

  const equipmentOptions: { value: EquipmentType; label: string; helper: string }[] = [
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
            <span>{Math.round(((step) / (TOTAL_STEPS - 1)) * 100)}%</span>
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
                  onClick={() => setProjectType("retrofit_full")}
                  className={`w-full text-left rounded-lg border-2 p-4 transition-colors ${
                    projectType === "retrofit_full"
                      ? "border-[#2563eb] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium text-gray-900">
                    Existing Home — Full Displacement
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Completely replacing your current heating system (e.g.,
                    removing your furnace or boiler entirely)
                  </p>
                </button>
                <button
                  onClick={() => setProjectType("retrofit_partial")}
                  className={`w-full text-left rounded-lg border-2 p-4 transition-colors ${
                    projectType === "retrofit_partial"
                      ? "border-[#2563eb] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium text-gray-900">
                    Existing Home — Partial Displacement
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Adding a heat pump alongside your existing heating system
                    (keeping your furnace as backup)
                  </p>
                </button>
              </div>
            )}

            {/* Step 4: Equipment Type */}
            {step === 4 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Not sure? Most homes use ducted or ductless air source heat
                  pumps.
                </p>
                {equipmentOptions.map((opt) => (
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

            {/* Step 5: Additional Details */}
            {step === 5 && (
              <div className="space-y-6">
                {equipmentType === "hpwh" && (
                  <div>
                    <Label className="font-medium text-gray-900">
                      What is the water heater replacing?
                    </Label>
                    <div className="mt-2 space-y-2">
                      <button
                        onClick={() => setWaterHeaterReplace("electric")}
                        className={`w-full text-left rounded-lg border-2 p-3 transition-colors ${
                          waterHeaterReplace === "electric"
                            ? "border-[#2563eb] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        Electric water heater
                      </button>
                      <button
                        onClick={() => setWaterHeaterReplace("fossil_fuel")}
                        className={`w-full text-left rounded-lg border-2 p-3 transition-colors ${
                          waterHeaterReplace === "fossil_fuel"
                            ? "border-[#2563eb] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        Gas, oil, or propane water heater
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="sqft" className="font-medium text-gray-900">
                    Approximate home size (sq ft)
                  </Label>
                  <p className="text-sm text-gray-500 mt-1 mb-2">
                    Optional — helps us estimate system size
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
