import { defineMessages } from 'react-intl';

export const GET_MOSAIC_SETTINGS = 'GET_MOSAIC_SETTINGS';
export const SET_MOSAIC_WIDTH = 'SET_MOSAIC_WIDTH';

// 767        768-1199      1200-1599     1600+
// mobile     tablet         desktop       widescreen

// export const breakpoints = { lg: 1489, md: 1118, sm: 608, xs: 350, xxs: 0 };

export const breakpoints = mosaic_width => {
  const breakpoints = { lg: 1600, md: 1200, sm: 768, xs: 350, xxs: 0 };
  if (!mosaic_width) return breakpoints;
  const windowWidth = __CLIENT__ && window.innerWidth;
  const margins = windowWidth - mosaic_width;
  const breakpoint = screentype =>
    windowWidth ? breakpoints[screentype] - margins : breakpoints[screentype];

  if (mosaic_width > breakpoint('lg')) {
    breakpoints.lg = breakpoint('lg');
  }
  if (mosaic_width > breakpoint('md')) {
    // TODO: why 22 ?
    breakpoints.md = parseInt(breakpoint('md')) + 22;
  }
  if (mosaic_width > breakpoint('sm')) {
    breakpoints.sm = breakpoint('sm');
  }
  if (mosaic_width > breakpoint('xs')) {
    breakpoints.xs = breakpoint('xs');
  }
  if (mosaic_width > breakpoint('xxs')) {
    breakpoints.xxs = breakpoint('xxs');
  }

  return breakpoints;
};

export const screenSizes = {
  lg: 'Unspecified (default)',
  md: 'Laptop',
  sm: 'Tablet',
  xs: 'Phone',
};

export const screenSizesOrder = ['lg', 'md', 'sm', 'xs'];

export const rowHeight = 21;

export const availableZoomLevels = ['100%', '75%', '50%', '25%'];

export const zoomClassNames = {
  '100%': 'zoom-100',
  '75%': 'zoom-75',
  '50%': 'zoom-50',
  '25%': 'zoom-25',
};

export const widthClass = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
};

export const zoomCoeficients = {
  '100%': 1,
  '75%': 0.75,
  '50%': 0.5,
  '25%': 0.25,
};

export const messages = defineMessages({
  addBlock: {
    id: 'Add block...',
    defaultMessage: 'Add block...',
  },
  required: {
    id: 'Required input is missing.',
    defaultMessage: 'Required input is missing.',
  },
  minLength: {
    id: 'Minimum length is {len}.',
    defaultMessage: 'Minimum length is {len}.',
  },
  uniqueItems: {
    id: 'Items must be unique.',
    defaultMessage: 'Items must be unique.',
  },
  save: {
    id: 'Save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  thereWereSomeErrors: {
    id: 'There were some errors.',
    defaultMessage: 'There were some errors.',
  },
});

export const ItemTypes = {
  ROW: 'row',
  COL: 'col',
};
