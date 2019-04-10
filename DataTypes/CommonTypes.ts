export namespace ctypes {
    export class SimpleResult {
        Result: boolean;

        constructor(res: boolean) {
            this.Result = res;
        }

        toJSON() {
            return JSON.stringify(this);
        }
    }

}
