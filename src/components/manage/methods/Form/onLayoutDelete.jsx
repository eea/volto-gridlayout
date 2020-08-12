import { getBlocksLayoutFieldname } from '@plone/volto/helpers';

const onLayoutDelete = ({ breakpoint, formData }) => {
  const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);
  const layoutField = formData[blocksLayoutFieldname];
  const mosaic_layout = layoutField.mosaic_layout || {};

  delete mosaic_layout[breakpoint];

  return {
    activeMosaicLayout: mosaic_layout['lg'],
    formData: {
      ...formData,
      [blocksLayoutFieldname]: {
        ...formData[blocksLayoutFieldname],
        mosaic_layout,
      },
    },
  };
};

export default onLayoutDelete;
