import { SetMetadata } from '@nestjs/common';
import { ROUTE_POLICY_KEY } from '../auth.constants';
import { Policy } from '../enums/route-policies.enum';

export const SetRoutePolicy = (policy: Policy) => {
  return SetMetadata(ROUTE_POLICY_KEY, policy);
};
