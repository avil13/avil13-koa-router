import { RouteInfo } from '../types';
import { showRouteList } from './show-route-list';

interface CheckCliArgumentsParams {
  arguments: string[];
  routes: RouteInfo[];
}

export const checkCliArguments = (params: CheckCliArgumentsParams) => {
  if (params.arguments.includes('route:list')) {
    showRouteList(params.routes);
    process.exit(0);
  }
};
