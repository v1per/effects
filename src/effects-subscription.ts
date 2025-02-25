import {
  Inject,
  Injectable,
  InjectionToken,
  OnDestroy,
  Optional,
  SkipSelf
} from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { merge } from 'rxjs/observable/merge';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { mergeEffects } from './effects';

export const effects = new InjectionToken('ngrx/effects: Effects');

@Injectable()
export class EffectsSubscription extends Subscription implements OnDestroy {
  constructor(
    @Inject(Store) private store: Observer<Action>,
    @Optional() @SkipSelf() public parent: EffectsSubscription,
    @Optional() @Inject(effects) effectInstances?: any[]
  ) {
    super();

    if (Boolean(parent)) {
      parent.add(this);
    }

    if (Boolean(effectInstances)) {
      this.addEffects(effectInstances);
    }
  }

  addEffects(effectInstances: any[]) {
    const sources = effectInstances.map(mergeEffects);
    const merged = merge(...sources);

    this.add(merged.subscribe(this.store));
  }

  ngOnDestroy() {
    if (!this.closed) {
      this.unsubscribe();
    }
  }
}
