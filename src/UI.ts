export interface ElementProperties {
  name: string;
  value: string;
}

export interface UIElement {
  rootContainerId?: string | undefined;
  tagElement: string;
  text?: string;
  properties?: ElementProperties[];
  children?: UI[];
}

export interface UIBuilderProperties {
  UIProperties: UIElement;
  element: HTMLElement;
}

export class UI {
  #UIProperties: UIElement = {} as UIElement;
  public element: HTMLElement = {} as HTMLElement;
  public rootContainerId: string | undefined = undefined;

  constructor(element: UIElement) {
    this.#UIProperties = element;
    this.element = this.#buildElement(element);

    this.rootContainerId = element.rootContainerId;

    if (this.rootContainerId !== undefined) {
      this.#initialize(this.rootContainerId);
    }
  }

  #setProperties(targetElement: HTMLElement, properties: ElementProperties[]) {
    if (properties !== undefined) {
      properties.forEach(property => {
        targetElement.setAttribute(property.name, property.value);
      })
    }
  }

  #buildElement(element: UIElement) {
    const createdElement = document.createElement(element.tagElement);
    const createdElementText = element.text && document.createTextNode(element.text);

    if (!!createdElementText) {
      createdElement.appendChild(createdElementText);
    }

    if (!!element.children) {
      this.#buildChildrenElements(createdElement, element.children);
    }

    this.#setProperties(createdElement, element.properties!);

    return createdElement;
  }

  #buildChildrenElements(targetElement: HTMLElement, elements: UI[]) {
    elements.forEach(element => {
      const createdElement = this.#buildElement(element.#UIProperties);
      targetElement.appendChild(createdElement);
    })
  }

  #initialize(rootContainerId: string) {
    const isRootContainerExist = document.getElementById(rootContainerId);

    if (isRootContainerExist) {
      const rootContainerElement = document.getElementById(rootContainerId);
      rootContainerElement?.appendChild(this.element);
    } else {
      console.error("Failed to instantiate the root container. The root container ID was defined correctly ?")
    }
  }
}
