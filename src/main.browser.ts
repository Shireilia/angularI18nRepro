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
  console.log('IN MAIN');
  return bootstrapI18n(AppModule, smpLocale);
}

function loadTranslation(locale: string): Promise<string> {
   console.log('IN loadTranslation');
  return System.import('../locale/messages.' + locale + '.xlf');
}

function bootstrapI18n(appModule: any, smpLocale: string) {
  console.log('IN bootstrapI18n');
  return getTranslationProviders(smpLocale).then(providers => {
    console.log('IN providers i got', providers);
    const compilerOptions = { providers };
    return bootstrapWithOptions(appModule, compilerOptions);
  });
}

function getTranslationProviders(locale: string): Promise<Object[]> {
  console.log('IN GET with locale', locale);
  let providers: Promise<Object[]>;
  const noProviders: Object[] = [];
  if (locale === undefined) {
    console.log('got in undefined', locale);
    providers = new Promise(resolve => { resolve(noProviders); });
  } else {
    console.log('fuck you')
    providers = loadTranslation(locale)
      .then((translations: string) => {
        console.log('YOHO', translations);
        return [
        { provide: TRANSLATIONS, useValue: translations },
        { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
        { provide: LOCALE_ID, useValue: locale }
      ];
      })
      .catch((e) => {
        console.log('got error', e);
        return noProviders
      });
  }
  return providers;
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
