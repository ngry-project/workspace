import { Observable } from 'rxjs';

/**
 * @internal
 */
export type AppInitializer = () => void | Promise<void> | Observable<unknown>;
