import { v4 as uuid } from 'uuid';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
function closest(array, num) {
  var i = 0;
  var minDiff = 1000;
  var ans;
  for (i in array) {
    var m = Math.abs(num - array[i]);
    if (m < minDiff) {
      minDiff = m;
      ans = array[i];
    }
  }
  return ans;
}
const onChangeWidth = ({
  beforeWidth,
  afterWidth,
  columnWidth,
  formData,
  blockLayout,
  columnsWidths,
  snapWidths,
  activeScreenSize,
}) => {
  const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);
  const id = blockLayout.id;
  const closestTo = closest(snapWidths, afterWidth);
  const colValue = Object.keys(columnsWidths).find(
    key => columnsWidths[key] === closestTo,
  );
  const newGridLayout = formData[blocksLayoutFieldname].grid_layout[
    activeScreenSize
  ].map(item => ({
    ...item,
    width: item.id === id ? parseInt(colValue) : parseInt(item.width),
  }));

  return {
    ...formData,
    [blocksLayoutFieldname]: {
      ...formData[blocksLayoutFieldname],
      grid_layout: {
        ...formData[blocksLayoutFieldname].grid_layout,
        [activeScreenSize]: newGridLayout,
      },
    },
  };
};

export default onChangeWidth;
