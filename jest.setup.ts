import "@testing-library/jest-dom";
import React from "react";

// Polyfill for React.act in React 19
if (typeof React.act === "undefined") {
  // @ts-expect-error - Adding act polyfill for React 19
  React.act = async (callback: () => void | Promise<void>) => {
    const result = callback();
    if (result && typeof result.then === "function") {
      await result;
    }
    return result;
  };
}
