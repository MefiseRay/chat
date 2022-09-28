import Block from "./Block";
import {DropdownMenu} from "../components/DropdownMenu";

export type PlainObject<T = any> = {
  [k in string]: T;
};

export function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object'
    && value !== null
    && value.constructor === Object
    && Object.prototype.toString.call(value) === '[object Object]';
}

export function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}

export function isArrayOrObject(value: unknown): value is [] | PlainObject {
  return isPlainObject(value) || isArray(value);
}

export function getKey(key: string, parentKey?: string) {
  return parentKey ? `${parentKey}[${key}]` : key;
}

export function getParams(data: PlainObject | [], parentKey?: string) {
  const result: [string, string][] = [];
  for (const [key, value] of Object.entries(data)) {
    if (isArrayOrObject(value)) {
      result.push(...getParams(value, getKey(key, parentKey)));
    } else {
      result.push([getKey(key, parentKey), encodeURIComponent(String(value))]);
    }
  }
  return result;
}

export function queryString(data: PlainObject) {
  if (!isPlainObject(data)) {
    throw new Error('input must be an object');
  }
  return getParams(data).map(arr => arr.join('=')).join('&');
}

export function isEqual(lhs: PlainObject, rhs: PlainObject) {
  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return false;
  }
  for (const [key, value] of Object.entries(lhs)) {
    const rightValue = rhs[key];
    if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
      if (isEqual(value, rightValue)) {
        continue;
      }
      return false;
    }
    if (value !== rightValue) {
      return false;
    }
  }

  return true;
}

export function merge(lhs: PlainObject, rhs: PlainObject, rewrite = false): PlainObject {
  for (let p in rhs) {
    if (!rhs.hasOwnProperty(p)) {
      continue;
    }
    try {
      if (rhs[p].constructor === Object && !rewrite) {
        rhs[p] = merge(lhs[p] as PlainObject, rhs[p] as PlainObject);
      } else {
        lhs[p] = rhs[p];
      }
    } catch (e) {
      lhs[p] = rhs[p];
    }
  }
  return lhs;
}

export function set(object: PlainObject | unknown, path: string, value: unknown, rewrite = false): PlainObject | unknown {
  if (typeof object !== 'object' || object === null) {
    return object;
  }
  const result = path.split('.').reduceRight<PlainObject>((acc, key) => ({
    [key]: acc,
  }), value as any);

  return merge(object as PlainObject, result, rewrite);
}

export function debounce(fn: Function, ms:number = 300)  {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  }
}

export function makeDropdown(
  dropdown: Block<Record<string, unknown>>,
  target: HTMLElement,
  hShift: number = 10,
  vShift: number = 10
) {
  dropdown.element!.style.position = "fixed";
  document.body.append(dropdown.getContent()!);
  dropdown.dispatchComponentDidMount();
  const sourceElRect = target.getBoundingClientRect();
  const elRect = dropdown.element!.getBoundingClientRect();
  let top = sourceElRect.bottom + vShift;
  let left = sourceElRect.left + hShift;
  if (top + elRect.height > document.documentElement.clientHeight) {
    top = sourceElRect.top - elRect.height - vShift;
  }
  if (left + elRect.width > document.documentElement.clientWidth) {
    left = sourceElRect.left - elRect.width - hShift;
  }
  dropdown.element!.style.top = `${top}px`;
  dropdown.element!.style.left = `${left}px`;
  document.addEventListener('scroll', () => {
    closeDropdown(dropdown);
  });
  document.addEventListener('click', (event: MouseEvent) => {
    if (event.target) {
      if (
        !dropdown.element!.contains(event.target as HTMLElement)
        && !target.contains(event.target as HTMLElement)
      ) {
        closeDropdown(dropdown);
      }
    }
  });
}

export function  closeDropdown(dropdown: Block<Record<string, unknown>>) {
  if(dropdown) {
    dropdown.element!.remove();
  }
}