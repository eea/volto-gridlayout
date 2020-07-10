import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
// import _ from 'lodash';
// import { omit, without } from 'lodash';

import { reject } from 'volto-mosaic/helpers';

const onRemoveItem = ({ id, formData, activeScreenSize }) => {
  const blocksFieldname = getBlocksFieldname(formData);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);
  const layoutField = formData[blocksLayoutFieldname].grid_layout;
  const itemsField = formData[blocksLayoutFieldname].items;

  // const grid_layout = Array.isArray(id)
  //   ? layoutField?.filter(item => !id.includes(item.id)) || {}
  //   : layoutField?.filter(item => item.id !== id) || {};

  let newGridLayout = {};
  Object.keys(layoutField).forEach(key => {
    if (!Array.isArray(id)) {
      newGridLayout[key] = [
        ...(layoutField[key]?.filter(item => item.id !== id) || {}),
      ];
    } else {
      newGridLayout[key] = [
        ...(layoutField[key]?.filter(item => !id.includes(item.id)) || {}),
      ];
    }
  });

  const items = Array.isArray(id)
    ? itemsField.filter(item => !id.includes(item))
    : itemsField.filter(item => item !== id);
  // grid_layout[this.state.activeScreenSize] = activeMosaicLayout;ix
  return {
    ...formData,
    [blocksLayoutFieldname]: {
      ...formData[blocksLayoutFieldname],
      items,
      grid_layout: newGridLayout,
    },
    [blocksFieldname]: reject(
      formData[blocksFieldname],
      Array.isArray(id) ? id : [id],
    ),
  };
};
export default onRemoveItem;
