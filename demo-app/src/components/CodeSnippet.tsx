import React, { useState } from 'react';

interface CodeSnippetProps {
  title?: string;
  code: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ title, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy snippet', error);
    }
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950/95 text-gray-100 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2 text-xs">
        <span className="font-medium uppercase tracking-wide text-gray-400">
          {title ?? 'Code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="font-medium text-gray-300 hover:text-white transition"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};
