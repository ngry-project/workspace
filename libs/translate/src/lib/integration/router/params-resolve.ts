import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Params } from '../../params';

export type ParamsResolve = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => Observable<Params>;
