const buildHookTemplate = (name: string) => {
  return `export const use${name} = () => {}`;
};

export default buildHookTemplate;
