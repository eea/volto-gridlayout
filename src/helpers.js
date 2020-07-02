import { arrayToTree } from 'performant-array-to-tree';


export function reject(obj, keys) {
  return Object.keys(obj)
    .filter(k => !keys.includes(k))
    .map(k => Object.assign({}, { [k]: obj[k] }))
    .reduce((res, o) => Object.assign(res, o), {});
}

// Instead of Object.fromEntries
export function fromEntries(iterable) {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val;
    return obj;
  }, {});
}

export function unflattenToHTML({ blocks_layout, activeScreenSize }) {
  // console.log('blocks layout in unflatten', blocks_layout);
  let grid_layout = {};
  if (blocks_layout.mosaic_layout && !blocks_layout.grid_layout) {
    grid_layout = Object.keys(blocks_layout.mosaic_layout).reduce(
      (obj, key) => {
        return {
          [key]: blocks_layout.mosaic_layout[key].map(item => ({
            id: item.i || item.id,
            className: item.className || 'row',
            position: item.position || 0,
            parentId: item.parentId || null,
            width: 12,
            type: 'row',
          })),
        };
      },
      {},
    );
  } else {
    // grid_layout = blocks_layout.grid_layout.map(item => ({
    //   ...item,
    //   position: blocks_layout.grid_layout.indexOf(item),
    // }));
    grid_layout = blocks_layout.grid_layout[activeScreenSize];
  }
  return arrayToTree(grid_layout);
}
