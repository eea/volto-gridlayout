import { v4 as uuid } from 'uuid';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';

const onAddBlock = ({
  type,
  formData,
  className,
  position,
  parentId,
  width,
  activeScreenSize,
  setFormData,
}) => {
  // Handles the creation of a new block in the layout editor
  const id = uuid();

  // const formData = formData;
  const blocksFieldname = getBlocksFieldname(formData);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);
  const newBlock = {
    id: id,
    className: className || 'row',
    position: position || 0,
    parentId: parentId || null,
    width: width || 12,
    type: type || 'row',
  };

  let newRowBlock = {};

  if (type === 'empty-column') {
    newRowBlock = {
      id: uuid(),
      className: 'row',
      position: position + 1,
      parentId: id,
      width: 12,
      type: 'row',
    };
  }

  const newStructure = Object.keys(newRowBlock).length
    ? [newBlock, newRowBlock]
    : [newBlock];

  console.log('newstructure', newStructure, type);
  let newGridLayout = {};
  Object.keys(formData[blocksLayoutFieldname].grid_layout).forEach(key => {
    newGridLayout[key] = [
      ...formData[blocksLayoutFieldname].grid_layout[key],
      ...newStructure,
    ];
  });

  if (!['row', 'empty-column'].includes(type)) {
    setFormData({
      ...formData,
      [blocksLayoutFieldname]: {
        items: [...(formData[blocksLayoutFieldname].items || []), id],
        grid_layout: newGridLayout,
      },
      [blocksFieldname]: {
        ...formData[blocksFieldname],
        [id]: {
          '@type': type,
        },
      },
    });
  } else {
    setFormData({
      ...formData,
      [blocksLayoutFieldname]: {
        items: [...(formData[blocksLayoutFieldname].items || []), id],
        grid_layout: newGridLayout,
      },
    });
  }
};

export default onAddBlock;
