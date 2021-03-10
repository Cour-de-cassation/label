export { keysOf };

function keysOf<T extends string | number>(object: Record<T, any>) {
  return Object.keys(object) as T[];
}
