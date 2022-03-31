import { RouteInfo } from '../types';

export const showRouteList = (routes: RouteInfo[]) => {
  console.table(routes);
};
