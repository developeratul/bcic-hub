import { ReactNode } from "react";

export interface AppProps {
  children: ReactNode;
}

export type ActionResponse<T> =
  | { type: "error"; message: string }
  | { type: "success"; message?: string; data: T };
