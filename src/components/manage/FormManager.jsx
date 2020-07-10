/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import {
  rowHeight,
  breakpoints,
  screenSizes,
  zoomClassNames,
  zoomCoeficients,
  screenSizesOrder,
} from '../../constants';
import { widthClass } from 'volto-gridlayout/constants';

const makeClassMapping = formData => {
  const blocksLayoutFieldname = getBlocksLayoutFieldname();
  const grid_layout = formData[blocksLayoutFieldname].grid_layout;
  formData[blocksLayoutFieldname].classMapping = formData[
    blocksLayoutFieldname
  ].items.reduce((container, key) => {
    let classMapping = {};
    Object.keys(grid_layout).forEach(layout => {
      grid_layout[layout].forEach(gridItem => {
        if (gridItem.className !== 'row')
          classMapping[gridItem.id] = `${classMapping[gridItem.id] ||
            ''} ${layout}-${widthClass[gridItem.width]}`;
      });
    });

    container = {
      ...container,
      ...classMapping,
    };
    return container;
  }, {});

  return formData;
};

const FormManager = WrappedComponent => props => {
  let initialFormData = JSON.parse(JSON.stringify(props.formData));
  let formDataOrdered;

  const blocksLayoutFieldname = getBlocksLayoutFieldname(props.formData);

  useEffect(() => {
    require('../../css/grid-layout.less');
  }, []);
  const [activeScreenSize, setActiveScreenSize] = useState('lg');

  if (!initialFormData[blocksLayoutFieldname].grid_layout) {
    initialFormData = {
      ...initialFormData,
      [blocksLayoutFieldname]: {
        ...initialFormData[blocksLayoutFieldname],
        grid_layout: {
          lg: initialFormData[blocksLayoutFieldname].items.map((v, k) => ({
            id: v,
            className: 'row',
            position: k,
            parentId: null,
          })),
        },
      },
    };
    formDataOrdered = initialFormData;
  } else {
    formDataOrdered = initialFormData;
    screenSizesOrder.forEach(size => {
      if (formDataOrdered?.blocks_layout?.grid_layout?.[size])
        formDataOrdered = {
          ...formDataOrdered,
          blocks_layout: {
            ...formDataOrdered.blocks_layout,
            grid_layout: {
              ...formDataOrdered.blocks_layout.grid_layout,
              [size]: formDataOrdered.blocks_layout.grid_layout[size].map(
                item => ({
                  ...item,
                  position: formDataOrdered.blocks_layout.grid_layout[
                    size
                  ].indexOf(item),
                }),
              ),
            },
          },
        };
    });
  }

  formDataOrdered = makeClassMapping(formDataOrdered);

  const availableScreens = Object.keys(screenSizes).map(k => {
    return { key: k, text: screenSizes[k], value: k };
  });

  const [formData, setFormData] = useState(formDataOrdered);

  const hasLayoutForCurrentActiveScreensize =
    formData[blocksLayoutFieldname].grid_layout[activeScreenSize];

  useEffect(() => {
    if (activeScreenSize !== 'lg' && !hasLayoutForCurrentActiveScreensize) {
      // console.log('size in useffect', size);
      const activeScreenSizes = screenSizesOrder.filter(
        item => formData[blocksLayoutFieldname].grid_layout[item],
      );
      const previousLayout =
        formData[blocksLayoutFieldname].grid_layout[activeScreenSizes[0]];
      console.log(
        'in useffect',
        hasLayoutForCurrentActiveScreensize,
        previousLayout,
        formData,
      );
      if (previousLayout) {
        setActiveScreenSize(activeScreenSize);
        setFormData({
          ...formData,
          [blocksLayoutFieldname]: {
            ...formData[blocksLayoutFieldname],
            grid_layout: {
              ...formData[blocksLayoutFieldname].grid_layout,
              [activeScreenSize]: previousLayout,
            },
          },
        });
      }
    }
  }, [activeScreenSize]);

  console.log('hasactivescreensize', hasLayoutForCurrentActiveScreensize);
  if (activeScreenSize !== 'lg' && !hasLayoutForCurrentActiveScreensize) {
    return '';
  }

  console.log('formData in manage', formData);
  const updateFormData = fdata => {
    setFormData(makeClassMapping(fdata));
  };
  const updatedProps = {
    ...props,
    formData: {
      ...formData,
    },
    setFormData: updateFormData,
    setActiveScreenSize,
    activeScreenSize,
    availableScreens,
  };
  console.log('updated props', updatedProps);
  return <WrappedComponent {...updatedProps} />;
};

export default FormManager;
