import 'reflect-metadata'
export class Injector {
  private readonly providerMap: Map<any, any> = new Map()
  private readonly instanceMap: Map<any, any> = new Map()
  public setProvider(key: any, value: any): void {
    if (!this.providerMap.has(key)) this.providerMap.set(key, value)
  }
  public getProvider(key: any): any {
    return this.providerMap.get(key)
  }
  public setInstance(key: any, value: any): void {
    if (!this.instanceMap.has(key)) this.instanceMap.set(key, value)
  }
  public getInstance(key: any): any {
    if (this.instanceMap.has(key)) return this.instanceMap.get(key)
    return null
  }
  public setValue(key: any, value: any): void {
    if (!this.instanceMap.has(key)) this.instanceMap.set(key, value)
  }
}

export const rootInjector = new Injector()

export function Injectable(): (_constructor: any) => any {
  return function (_constructor: any): any {
    rootInjector.setProvider(_constructor, _constructor)
    return _constructor
  }
}

export function Inject(): (_constructor: any, propertyName: string) => any {
    return function (_constructor: any, propertyName: string): any {
      const  propertyType: any = Reflect.getMetadata('design:type', _constructor, propertyName);
      const injector: Injector = rootInjector;
   
      let providerInstance = injector.getInstance(propertyType);
      if (!providerInstance) {
          injector.getProvider(propertyType);
          providerInstance = new providerClass();
          injector.setInstance(key, providerInstance);
      }
      _constructor[propertyName] = providerInstance;
   
      return (_constructor as any)[propertyName];
    };
  }