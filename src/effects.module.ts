import {
  APP_BOOTSTRAP_LISTENER,
  Injector,
  NgModule,
  Type
} from '@angular/core';
import { Actions } from './actions';
import {
  afterBootstrapEffects,
  runAfterBootstrapEffects
} from './bootstrap-listener';
import { effects, EffectsSubscription } from './effects-subscription';

@NgModule({
  providers: [
    Actions,
    EffectsSubscription,
    {
      provide: APP_BOOTSTRAP_LISTENER,
      multi: true,
      deps: [Injector, EffectsSubscription],
      useFactory: runAfterBootstrapEffects
    }
  ]
})
export class EffectsModule {
  static run(type: Type<any>) {
    return {
      ngModule: EffectsModule,
      providers: [
        EffectsSubscription,
        type,
        { provide: effects, useExisting: type, multi: true }
      ]
    };
  }

  static runAfterBootstrap(type: Type<any>) {
    return {
      ngModule: EffectsModule,
      providers: [
        type,
        { provide: afterBootstrapEffects, useExisting: type, multi: true }
      ]
    };
  }

  constructor(private effectsSubscription: EffectsSubscription) {}
}
