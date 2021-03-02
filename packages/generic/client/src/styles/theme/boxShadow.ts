export { boxShadow };

const boxShadow = {
  minor: {
    in: `inset 0px 0px 11px rgba(0, 0, 0, 0.24), inset 2px 2px 4px rgba(0, 0, 0, 0.22), inset 0px 0px 2px rgba(0, 0, 0, 0.4)`,
    out: `0px 0px 11px rgba(0, 0, 0, 0.24), 2px 2px 4px rgba(0, 0, 0, 0.22), 0px 0px 2px rgba(0, 0, 0, 0.4)`,
  },
  major: {
    in: `inset 0px 16px 24px rgba(0, 0, 0, 0.14), inset 0px 6px 30px rgba(0, 0, 0, 0.12), inset 0px 0px 10px rgba(0, 0, 0, 0.42)`,
    out: `0px 16px 24px rgba(0, 0, 0, 0.14), 0px 6px 30px rgba(0, 0, 0, 0.12), 0px 0px 10px rgba(0, 0, 0, 0.42)`,
  },
};
