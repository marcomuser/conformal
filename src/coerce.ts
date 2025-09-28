export function coerceString(input: unknown): unknown {
  if (typeof input !== "string") {
    return input;
  }

  if (input === "") {
    return undefined;
  }
  return input;
}

export function coerceNumber(input: unknown): unknown {
  if (typeof input !== "string") {
    return input;
  }
  if (input.trim() === "") {
    return undefined;
  }
  const number = Number(input);
  return Number.isNaN(number) ? input : number;
}

export function coerceBigint(input: unknown): unknown {
  if (typeof input !== "string") {
    return input;
  }
  if (input.trim() === "") {
    return undefined;
  }
  try {
    return BigInt(input);
  } catch {
    return input;
  }
}

export function coerceBoolean(input: unknown): unknown {
  if (typeof input !== "string") {
    return input;
  }
  if (input === "") {
    return undefined;
  }
  if (input === "true" || input === "on" || input === "1" || input === "yes") {
    return true;
  }
  if (input === "false" || input === "off" || input === "0" || input === "no") {
    return false;
  }
  return input;
}

export function coerceDate(input: unknown): unknown {
  if (typeof input !== "string") {
    return input;
  }
  if (input === "") {
    return undefined;
  }
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? input : date;
}

export function coerceFile(input: unknown): unknown {
  if (!(input instanceof File)) {
    return input;
  }
  if (input.size === 0) {
    return undefined;
  }
  return input;
}

export function coerceArray(input: unknown): unknown[] {
  if (Array.isArray(input)) {
    return input;
  }
  if (input === "") {
    return [];
  }
  return [input];
}
