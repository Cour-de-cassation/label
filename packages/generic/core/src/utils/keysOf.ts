export { keysOf };

function keysOf<T extends string | number | symbol>(object: Record<T, any>) {
  return Object.keys(object) as T[];
}
