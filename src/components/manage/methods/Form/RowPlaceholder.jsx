import React from 'react';
import { blocks } from '~/config';
import { Radio, Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components'; // EditBlock
import deleteIcon from '@plone/volto/icons/delete.svg';
import addIcon from '@plone/volto/icons/add.svg';
import { getBlocksFieldname } from '@plone/volto/helpers';
import onAddBlock from './onAddBlock';
const renderRowPlaceholder = ({
  children,
  blockLayout,
  formData,
  removeItem,
  activeScreenSize,
  setFormData,
}) => {
  // console.log('row props', children, blockLayout, parentId, formData, addBlock);
  const currentRowItems = formData.blocks_layout.grid_layout[
    activeScreenSize
  ].filter(item => item.parentId === blockLayout.id);
  let position = 0;
  let currentRowItemsIds = [blockLayout.id];
  if (currentRowItems.length) {
    position =
      Math.max(...currentRowItems.map(item => parseInt(item.position))) + 1;
    currentRowItemsIds = [
      ...currentRowItemsIds,
      ...currentRowItems.map(item => item.id),
    ];
  }

  return (
    <React.Fragment>
      <div className="row-edit-controls">
        <Icon
          onClick={() =>
            onAddBlock({
              type: 'text',
              formData,
              className: 'column',
              position: position,
              parentId: blockLayout.id,
              width: 6,
              activeScreenSize,
              setFormData,
            })
          }
          name={addIcon}
          size="20"
        />

        <Icon
          onClick={() => removeItem(currentRowItemsIds)}
          name={deleteIcon}
          size="20"
        />
      </div>
      {children}
    </React.Fragment>
  );
};
export default renderRowPlaceholder;
