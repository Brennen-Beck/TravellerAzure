"use client"; // Ensure this runs in the browser

import { useState } from "react";

const CopyCSVButton = (props: any) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const data = props.data || [];
    if (!Array.isArray(data) || data.length === 0) return;

    // Convert all values to strings
    const headers = Object.keys(data[0]).map(String).join(",");
    const rows = data.map(entry =>
      Object.values(entry).map(value => `"${String(value)}"`).join(",")
    );

    const csvString = [headers, ...rows].join("\n");

    navigator.clipboard.writeText(csvString)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error("Failed to copy:", err));
  };

  return (
    <button 
      onClick={copyToClipboard} 
      className="text-sm px-4 py-2 rounded bg-background text-primary-foreground shadow hover:bg-accent hover:text-primary outline outline-1 outline-border"
    >
      {copied ? "Copied!" : "Clipboard"}
    </button>
  );
};

export default CopyCSVButton;
