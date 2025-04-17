export function setDark(element: HTMLElement) {
  const style = ([...document.styleSheets].flatMap(_ => [..._.cssRules]) as CSSStyleRule[]).find(_ => _.selectorText === "html.dark")?.style;
  if (style) for (const name of style!) {
    element.style.setProperty(name, style.getPropertyValue(name))
  }
}