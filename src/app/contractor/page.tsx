"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SAMPLE_PROJECTS, getDocumentReadiness } from "@/lib/data";

type FilterTab = "all" | "active" | "needs_docs" | "completed";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  in_progress: "bg-amber-100 text-amber-700",
  complete: "bg-green-100 text-green-700",
  denied: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  in_progress: "In Progress",
  complete: "Complete",
  denied: "Denied",
};

export default function ContractorPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");

  const filteredProjects = SAMPLE_PROJECTS.filter((p) => {
    if (filter === "all") return true;
    if (filter === "active") return ["draft", "submitted", "in_progress"].includes(p.status);
    if (filter === "needs_docs") return p.documents.some((d) => d.required && d.status === "missing");
    if (filter === "completed") return p.status === "complete";
    return true;
  });

  const activeCount = SAMPLE_PROJECTS.filter((p) =>
    ["draft", "submitted", "in_progress"].includes(p.status)
  ).length;
  const completedCount = SAMPLE_PROJECTS.filter((p) => p.status === "complete").length;
  const needsDocsCount = SAMPLE_PROJECTS.filter((p) =>
    p.documents.some((d) => d.required && d.status === "missing")
  ).length;

  if (!isLoggedIn) {
    return (
      <div className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Contractor Login
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Sign in to manage your NYS Clean Heat projects.
          </p>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                onClick={() => setIsLoggedIn(true)}
              >
                Sign In
              </Button>
              <p className="text-xs text-center text-gray-500">
                Demo mode — click Sign In with any credentials
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, Green Energy Solutions
            </h1>
            <p className="text-gray-600">Manage your NYS Clean Heat projects</p>
          </div>
          <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            + New Project
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-3xl font-bold text-[#16a34a]">{completedCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">Pending Documents</p>
              <p className="text-3xl font-bold text-amber-600">{needsDocsCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(
            [
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "needs_docs", label: "Needs Docs" },
              { key: "completed", label: "Completed" },
            ] as { key: FilterTab; label: string }[]
          ).map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab.key)}
              className={
                filter === tab.key
                  ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                  : "border-gray-300"
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Project List */}
        <div className="space-y-3">
          {filteredProjects.map((project) => {
            const readiness = getDocumentReadiness(project);
            return (
              <Link key={project.id} href={`/project/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {project.customerName}
                          </p>
                          <Badge
                            className={`text-xs ${STATUS_COLORS[project.status]}`}
                          >
                            {STATUS_LABELS[project.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {project.address}, {project.city}, {project.state}{" "}
                          {project.zip}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {project.categoryLabel} · {project.utilityLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 sm:w-48">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Docs</span>
                            <span>{readiness}%</span>
                          </div>
                          <Progress value={readiness} className="h-2" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 sm:w-24 text-right">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          {filteredProjects.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No projects match this filter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
