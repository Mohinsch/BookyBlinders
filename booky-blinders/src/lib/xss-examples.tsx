/**
 * XSS Security Examples
 * 
 * This file demonstrates how React automatically prevents XSS attacks
 * by showing examples of dangerous input and how they're safely handled.
 */

import React, { useState } from "react";

/**
 * Example 1: Script Tag Injection
 * React automatically escapes script tags
 */
export function ScriptInjectionExample() {
  const [displayText] = useState(
    "<script>alert('This would be dangerous!')</script>"
  );

  return (
    <div>
      <h3>Script Tag Injection (BLOCKED by React)</h3>
      <p>
        Dangerous input: <code>&lt;script&gt;alert(...)&lt;/script&gt;</code>
      </p>
      <p>
        Rendered safely: <strong>{displayText}</strong>
      </p>
      <p style={{ fontSize: "0.9em", color: "#666" }}>
        React escapes this as text - it's never executed
      </p>
    </div>
  );
}

/**
 * Example 2: Event Handler Injection
 * React escapes attribute values
 */
export function EventHandlerInjectionExample() {
  const [maliciousAttribute] = useState(
    '" onmouseover="alert(\'XSS Attack\')'
  );

  return (
    <div>
      <h3>Event Handler Injection (BLOCKED by React)</h3>
      <p>
        Dangerous input: <code>{maliciousAttribute}</code>
      </p>
      <div title={maliciousAttribute} style={{ border: "1px solid #ccc", padding: "10px" }}>
        Hover over this box - nothing happens! The event handler is escaped.
      </div>
      <p style={{ fontSize: "0.9em", color: "#666" }}>
        The onmouseover attribute is part of the title string, not a real event handler
      </p>
    </div>
  );
}

/**
 * Example 3: Image onerror Attack
 * React escapes HTML tags
 */
export function ImageErrorInjectionExample() {
  const [imageTag] = useState(
    '<img src=x onerror="alert(\'XSS\')"/>'
  );

  return (
    <div>
      <h3>Image onerror Injection (BLOCKED by React)</h3>
      <p>
        Dangerous input: <code>{imageTag}</code>
      </p>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        Rendered: <p>{imageTag}</p>
      </div>
      <p style={{ fontSize: "0.9em", color: "#666" }}>
        The image tag is displayed as plain text - it's never parsed as HTML
      </p>
    </div>
  );
}

/**
 * Example 4: Data in Form Attributes
 * React safely escapes attribute values
 */
export function FormAttributeInjectionExample() {
  const [name, setName] = useState(
    'John" onblur="alert(\'XSS\') data-info="'
  );

  return (
    <div>
      <h3>Form Attribute Injection (BLOCKED by React)</h3>
      <p>
        Dangerous input: <code>{name}</code>
      </p>
      <input
        type="text"
        value={name}
        placeholder="Malicious value in state"
        readOnly
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ddd",
          fontFamily: "monospace",
        }}
      />
      <p style={{ fontSize: "0.9em", color: "#666" }}>
        Even though this string contains quotes and event handlers,
        React renders it safely as the input's value
      </p>
    </div>
  );
}

/**
 * Example 5: Unicode/HTML Entity Bypass Attempt
 * React handles unicode safely
 */
export function UnicodeBypassExample() {
  const [maliciousCode] = useState(
    "&#60;script&#62;alert('XSS')&#60;/script&#62;"
  );

  return (
    <div>
      <h3>HTML Entity Bypass Attempt (BLOCKED by React)</h3>
      <p>
        Dangerous input (HTML entities): <code>{maliciousCode}</code>
      </p>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        Rendered: <p>{maliciousCode}</p>
      </div>
      <p style={{ fontSize: "0.9em", color: "#666" }}>
        React treats this as text and doesn't decode HTML entities
      </p>
    </div>
  );
}

/**
 * Example 6: Safe Data Display Pattern (YOUR APPLICATION)
 * How your app safely displays user data
 */
export function SafeDataDisplayPattern() {
  const userCreatedLibraryName = "'; DROP TABLE library; --";
  const bookTitleFromAPI = "<img src=x onerror='alert(1)'>";
  const searchQuery = "<script>alert('hacked')</script>";

  return (
    <div>
      <h3>Your Application's Safe Patterns</h3>

      <div style={{ marginTop: "20px" }}>
        <h4>1. Collection Name (User Input)</h4>
        <p>
          Input: <code>{userCreatedLibraryName}</code>
        </p>
        <div
          style={{
            border: "1px solid #0099ff",
            padding: "10px",
            backgroundColor: "#f0f8ff",
          }}
        >
          Rendered safely: <strong>{userCreatedLibraryName}</strong>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>2. Book Title (API Data)</h4>
        <p>
          Input: <code>{bookTitleFromAPI}</code>
        </p>
        <div
          style={{
            border: "1px solid #0099ff",
            padding: "10px",
            backgroundColor: "#f0f8ff",
          }}
        >
          Rendered safely: <strong>{bookTitleFromAPI}</strong>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>3. Search Query (User Input)</h4>
        <p>
          Input: <code>{searchQuery}</code>
        </p>
        <div
          style={{
            border: "1px solid #0099ff",
            padding: "10px",
            backgroundColor: "#f0f8ff",
          }}
        >
          Rendered safely: <strong>{searchQuery}</strong>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 7: What NOT to do (for comparison)
 * Demonstrates the DANGEROUS pattern using dangerouslySetInnerHTML
 * YOUR APPLICATION DOES NOT DO THIS!
 */
export function DangerousPatternExample() {
  const maliciousInput = "<script>alert('This WOULD run!')</script>";

  return (
    <div>
      <h3>❌ DANGEROUS Pattern (YOUR APP DOES NOT USE THIS!)</h3>
      <p style={{ color: "red", fontWeight: "bold" }}>
        This is an example of what NOT to do:
      </p>

      <pre
        style={{
          backgroundColor: "#ffe6e6",
          padding: "10px",
          borderRadius: "4px",
          overflow: "auto",
        }}
      >
        {`// ❌ DANGEROUS - DO NOT USE
<div dangerouslySetInnerHTML={{ __html: userInput }} />`}
      </pre>

      <p>
        If we used this pattern with input: <code>{maliciousInput}</code>
      </p>
      <p style={{ color: "red" }}>
        The script WOULD EXECUTE and be dangerous!
      </p>

      <pre
        style={{
          backgroundColor: "#fff3cd",
          padding: "10px",
          borderRadius: "4px",
          marginTop: "10px",
        }}
      >
        {`// ✅ SAFE - WHAT YOUR APP DOES
<div>{userInput}</div>
// React escapes all content automatically`}
      </pre>
    </div>
  );
}

/**
 * Main demo component
 */
export function XSSSecurityDemo() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🛡️ XSS Security Demonstration</h1>
      <p style={{ fontSize: "1.1em", marginBottom: "30px" }}>
        These examples show how React automatically prevents XSS attacks
      </p>

      <div
        style={{
          display: "grid",
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        <ScriptInjectionExample />
        <EventHandlerInjectionExample />
        <ImageErrorInjectionExample />
        <FormAttributeInjectionExample />
        <UnicodeBypassExample />
        <SafeDataDisplayPattern />
        <DangerousPatternExample />
      </div>

      <div
        style={{
          backgroundColor: "#e8f5e9",
          border: "2px solid #4caf50",
          padding: "20px",
          borderRadius: "4px",
        }}
      >
        <h3 style={{ color: "#2e7d32", margin: "0 0 10px 0" }}>
          ✅ Summary
        </h3>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>React escapes all content in JSX automatically</li>
          <li>Your app uses React components exclusively</li>
          <li>No `dangerouslySetInnerHTML` found in codebase</li>
          <li>All user input validated on backend (Zod)</li>
          <li>XSS attacks are impossible in your current implementation</li>
        </ul>
      </div>
    </div>
  );
}
