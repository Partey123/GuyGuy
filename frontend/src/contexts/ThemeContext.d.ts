declare module "@/contexts/ThemeContext" {
  export function ThemeProvider(props: { children: React.ReactNode }): JSX.Element;
  export function useTheme(): {
    theme: "light" | "dark" | "system";
    resolvedTheme: "light" | "dark";
    setTheme: (value: "light" | "dark" | "system") => void;
  };
}
