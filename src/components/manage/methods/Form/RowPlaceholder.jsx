import React from 'react';
import deleteIcon from '@plone/volto/icons/delete.svg';
import addIcon from '@plone/volto/icons/add.svg';
import onAddBlock from './onAddBlock';
import { Icon } from '@plone/volto/components'; // EditBlock
import { getBlocksLayoutFieldname } from '@plone/volto/helpers';
import { Button } from 'semantic-ui-react';

const renderRowPlaceholder = ({
  children,
  blockLayout,
  formData,
  removeItem,
  activeScreenSize,
  setFormData,
}) => {
  const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);

  // console.log('row props', children, blockLayout, parentId, formData, addBlock);
  const currentRowItems = formData[blocksLayoutFieldname].grid_layout[
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

        <span
          style={{
            display: 'inline-flex',
            cursor: 'pointer',
            border: '1px solid #eee',
          }}
          onClick={() =>
            onAddBlock({
              type: 'empty-column',
              formData,
              className: 'column empty',
              position: position,
              parentId: blockLayout.id,
              width: 6,
              activeScreenSize,
              setFormData,
            })
          }
        >
          <Icon name={addIcon} size="20" />
          Empty col
        </span>

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
