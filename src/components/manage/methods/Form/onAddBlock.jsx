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
  console.log(
    'formdata in addblock',
    type,
    formData,
    className,
    position,
    parentId,
    width,
  );
  console.log('classname in asta', className);
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
  if (className === 'column') {
    setFormData({
      ...formData,
      [blocksLayoutFieldname]: {
        items: [...(formData[blocksLayoutFieldname].items || []), id],
        grid_layout: {
          ...formData[blocksLayoutFieldname].grid_layout,
          [activeScreenSize]: [
            ...formData[blocksLayoutFieldname].grid_layout[activeScreenSize],
            newBlock,
          ],
        },
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
        grid_layout: {
          ...formData[blocksLayoutFieldname].grid_layout,
          [activeScreenSize]: [
            ...formData[blocksLayoutFieldname].grid_layout[activeScreenSize],
            newBlock,
          ],
        },
      },
    });
  }
};

export default onAddBlock;
