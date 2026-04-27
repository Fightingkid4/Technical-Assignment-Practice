import inject from "light-my-request";

import type { Express } from "express";

interface InjectOptions {
  method: "GET" | "POST" | "DELETE";
  url: string;
  body?: unknown;
}

export const apiRequest = async (app: Express, options: InjectOptions) => {
  const response = await inject(app, {
    method: options.method,
    url: options.url,
    headers: {
      ...(options.body ? { "content-type": "application/json" } : {})
    },
    payload: options.body ? JSON.stringify(options.body) : undefined
  });

  return {
    status: response.statusCode,
    body: response.body ? JSON.parse(response.body) : undefined
  };
};