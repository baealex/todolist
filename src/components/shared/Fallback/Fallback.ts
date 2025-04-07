interface FallbackReason {
  isEmpty: boolean;
  isError: boolean;
}

export class Fallback {
  static render(options: { children: () => string; fallback: (reason: Partial<FallbackReason>) => string }) {
    try {
      const renderedChildren = options.children();
      if (renderedChildren) {
        return renderedChildren;
      }
      return options.fallback({ isEmpty: true });
    } catch {
      return options.fallback({ isError: true });
    }
  }
}
