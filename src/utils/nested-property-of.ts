// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function nestedPropertyOf<TOuterObj, TInnerObj>(
  outerName: keyof TOuterObj,
  innerName: keyof TInnerObj,
) {
  return `${outerName.toString()}.${innerName.toString()}`;
}
