export const autos = Object.values(
  import.meta.glob('./*.png', { eager: true, import: 'default' })
);

export default autos;
