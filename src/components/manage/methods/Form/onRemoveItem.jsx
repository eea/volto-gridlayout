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
  console.log('id in remove', id);
  const layoutField =
    formData[blocksLayoutFieldname].grid_layout[activeScreenSize];
  const itemsField = formData[blocksLayoutFieldname].items;

  const grid_layout = Array.isArray(id)
    ? layoutField?.filter(item => !id.includes(item.id)) || {}
    : layoutField?.filter(item => item.id !== id) || {};

  const items = Array.isArray(id)
    ? itemsField.filter(item => !id.includes(item))
    : itemsField.filter(item => item !== id);
  // grid_layout[this.state.activeScreenSize] = activeMosaicLayout;ix
  console.log('removing items', grid_layout);
  return {
    ...formData,
    [blocksLayoutFieldname]: {
      ...formData[blocksLayoutFieldname],
      items,
      grid_layout: {
        ...formData[blocksLayoutFieldname].grid_layout,
        [activeScreenSize]: grid_layout, // TODO: might need JSON.stringify?
      },
    },
    [blocksFieldname]: reject(
      formData[blocksFieldname],
      Array.isArray(id) ? id : [id],
    ),
  };
};
export default onRemoveItem;
