export const applyStyle = (element: HTMLElement, style: Partial<CSSStyleDeclaration>) => {
  Object.assign(element.style, style);
};
