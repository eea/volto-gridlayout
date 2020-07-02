import * as addonReducers from './reducers';
import addonRoutes from './routes.js';

import GridLayoutView from './components/theme/View';
import GridLayoutForm from './components/manage/Form';

export function applyConfig(config) {
  // config.settings.nonContentRoutes.push('/mosaic-settings-view');

  return {
    ...config,
    addonReducers: {
      ...config.addonReducers,
      ...addonReducers,
    },
    views: {
      ...config.views,
      layoutViews: {
        ...config.views.layoutViews,
        grid_layout_view: GridLayoutView,
      },
    },
    editForms: {
      ...config.editForms,
      byLayout: {
        ...config.editForms?.byLayout,
        grid_layout_view: GridLayoutForm,
      },
    },
    addonRoutes: [...(config.addonRoutes || []), ...addonRoutes],
  };
}
