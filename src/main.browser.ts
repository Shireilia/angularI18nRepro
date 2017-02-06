/*
 * Angular bootstraping
 */
import { TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { decorateModuleRef } from './app/environment';
import { bootloader } from '@angularclass/hmr';
/*
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app';

function main(): Promise<any> {
  const smpLocale = 'fr-FR';
  return bootstrapI18n(AppModule, smpLocale);
}


function bootstrapI18n(appModule: any, smpLocale: string) {
  return getTranslationProviders(smpLocale).then(providers => {
    const compilerOptions = { providers };
    return bootstrapWithOptions(appModule, compilerOptions);
  });
}

function getTranslationProviders(locale: string): Promise<Object[]> {
  let providers: Promise<Object[]>;
  const noProviders: Object[] = [];
  if (locale === undefined) {
    providers = new Promise(resolve => { resolve(noProviders); });
  } else {
    providers = loadTranslation(locale)
      .then((translations: string) => {
        return [
          { provide: TRANSLATIONS, useValue: translations },
          { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
          { provide: LOCALE_ID, useValue: 'fr' }
        ];
      })
      .catch((e) => {
        console.log('got error', e);
        return noProviders
      });
  }
  return providers;
}

function loadTranslation(locale: string): Promise<string> {
  console.log('IN loadTranslation');
  let contentXlfFile = require(`raw-loader!../locale/messages.fr_FR.xlf`);
  return new Promise(resolve => {
    resolve(contentXlfFile.toString().trim());
  });
}

export function bootstrapWithOptions(appModule: any, compilerOptions: any) {
  console.log('IN bootstrapWithOptions');
  return platformBrowserDynamic()
    .bootstrapModule(appModule, compilerOptions)
    .then(decorateModuleRef)
    .catch(err => console.error(err));
}


// needed for hmr
// in prod this is replace for document ready
bootloader(main);
