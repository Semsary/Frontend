import React, { useState, useEffect } from "react";
import { useRouteError } from "react-router-dom";
import { AlertCircle, RefreshCw, Home, Bug } from "lucide-react";

const ErrorBoundary = () => {
  const error = useRouteError();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Basic error details
  const errorMessage = error?.message || "An unexpected error occurred";
  const errorStatus = error?.status?.toString() || "Unknown";
  const errorStack =
    error?.stack?.split("\n").slice(0, 3).join("\n") ||
    "No stack trace available";
  const errorId = `ERR-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 5)}`;

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleReturnHome = () => {
    window.location.href = "/";
  };

  const handleReportBug = () => {
    const bugReport = {
      errorId,
      errorMessage,
      errorStatus,
      errorStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    console.error("Bug Report:", bugReport);
    navigator.clipboard.writeText(JSON.stringify(bugReport, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white border border-gray-200">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Something went wrong
        </h1>

        <div className="flex justify-center gap-2 mb-4">
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
            Status: {errorStatus}
          </span>
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            ID: {errorId}
          </span>
        </div>

        <p className="text-center mb-4 text-gray-600">{errorMessage}</p>

        {errorStack && (
          <details className="mb-4 text-sm">
            <summary className="cursor-pointer font-medium">Details</summary>
            <pre className="mt-2 p-2 rounded bg-gray-50 overflow-auto max-h-40">
              {errorStack}
            </pre>
          </details>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleRefresh}
            disabled={isAnimating}
            className="flex items-center justify-center p-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isAnimating ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            onClick={handleReturnHome}
            className="flex items-center justify-center p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </button>
        </div>

        <button
          onClick={handleReportBug}
          className="text-sm flex items-center justify-center mx-auto gap-1 text-gray-500 hover:text-gray-700"
        >
          <Bug className="h-4 w-4" />
          {isCopied ? "Copied!" : "Report Issue"}
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
