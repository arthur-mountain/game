const PROPS_REGEX = /[a-zA-Z]/gi;
export const createElement = (type, props, ...childrens) => {
  const element = document.createElement(type);

  if (props) {
    if (typeof props === 'object') {
      Object
        .entries(props)
        .forEach(([key, value]) => {
          if (PROPS_REGEX.test()) {
            if (key === 'className') {
              element.setAttribute('class', value)
            } else if (!(/^on/gi).test(key)) {
              element.setAttribute(key, value);
            } else {
              const eventType = key.substring(2).toLowerCase();
              element.addEventListener(eventType, value);
            }
          } else {
            console.error('Props attribute key not eligible');
          }
        })
    } else {
      console.error('Props attribute error');
      return;
    }
  }

  if (Array.isArray(childrens)) {
    childrens.forEach(children => {
      if (typeof children === 'string') {
        element.appendChild(document.createTextNode(children));
      } else if (typeof children === 'object') {
        element.appendChild(children);
      }
    })
  }

  return element;
}

export const transTimeOut = (value) => {
  if (value <= 60) {
    return value;
  }

  const minutes = `${Math.floor(value / 60)}`.padStart(2, '0');
  const seconds = `${value % 60}`.padEnd(2, '0');

  return `${minutes}:${seconds}`;
}