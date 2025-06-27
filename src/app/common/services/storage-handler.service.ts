
export class StorageHandlerService {

  public static get(name: string): string {
    const value = sessionStorage.getItem(name);
    if (value != null) {
        return value;
    } else {
        return '';
    }
}

public static set(name: string, value: string): void {
    sessionStorage.setItem(name, value);
}

public static delete(key: string): void {
  sessionStorage.removeItem(key);
}

 
}
