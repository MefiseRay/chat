class RefElementsCollection {
  public readonly DEFAULT_ATTRIBUTE_NAME: string = 'ref-name';

  protected elementsCollection: Record<string, Record<string, Element>> = {};

  public setElementsCollection(
    fragment: DocumentFragment,
    nameSpase: string,
    attributeName: string = this.DEFAULT_ATTRIBUTE_NAME,
  ): void {
    fragment.querySelectorAll(`[${attributeName}]`).forEach((element: Element) => {
      const key: string = element.getAttribute(attributeName)!;
      if (!this.elementsCollection[nameSpase]) {
        this.elementsCollection[nameSpase] = {};
      }
      this.elementsCollection[nameSpase][key] = element;
    });
  }

  public getElement(nameSpase: string, key: string): Element {
    if (!this.elementsCollection[nameSpase][key]) {
      throw new Error(`Undefined element: ${nameSpase}/${key}`);
    }
    return this.elementsCollection[nameSpase][key];
  }

  public getElementsCollection(nameSpase: string): Record<string, Element> {
    if (!this.elementsCollection[nameSpase]) {
      throw new Error(`Undefined elements in name spase: ${nameSpase}`);
    }
    return this.elementsCollection[nameSpase];
  }
}

export default new RefElementsCollection();
