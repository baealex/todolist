interface FallbackReason {
  isEmpty: boolean;
  isError: boolean;
}

export class Fallback {
  static render(options: { children: () => string; fallbackRenderer: (reason: Partial<FallbackReason>) => string }) {
    try {
      return options.children() || options.fallbackRenderer({ isEmpty: true });
    } catch {
      return options.fallbackRenderer({ isError: true });
    }
  }
}
