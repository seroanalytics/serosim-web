import {
    EvalROptions,
    InstallPackagesOptions, REnvironment,
    RObject,
    Shelter,
    WebR
} from "webr";
import {ProxyConstructor} from "webr/dist/webR/proxy";

export class MockREnvironment {

}

export class MockShelter implements Partial<Shelter> {

    captureR(code: string, options?: EvalROptions): Promise<{
        result: RObject;
        output: { type: string; data: any }[];
        images: ImageBitmap[]
    }> {
        return Promise.resolve({images: [], output: [], result: {} as any});
    }

    destroy(x: RObject): Promise<void> {
        return Promise.resolve(undefined);
    }

    evalR(code: string, options?: EvalROptions): Promise<RObject> {
        return Promise.resolve(undefined as any);
    }

    init(): Promise<void> {
        return Promise.resolve(undefined);
    }

    purge(): Promise<void> {
        return Promise.resolve(undefined);
    }

}

export class MockWebR implements Partial<WebR> {

    evalR(code: string, options?: EvalROptions): Promise<RObject> {
        return Promise.resolve({} as any);
    }

    evalRVoid(code: string, options?: EvalROptions): Promise<void> {
        return Promise.resolve(undefined);
    }

    init(): Promise<unknown> {
        return Promise.resolve(undefined);
    }

    installPackages(packages: string | string[], options?: InstallPackagesOptions): Promise<void> {
        return Promise.resolve(undefined);
    }

    interrupt(): void {
    }

    Shelter = newShelterProxy()

    REnvironment = newREnvironmentProxy() as ProxyConstructor<REnvironment, REnvironment>
}

function newShelterProxy() {
    return new Proxy(MockShelter, {
        construct: async () =>  new MockShelter()
    }) as unknown as {
        new(): Promise<Shelter>;
    };
}

function newREnvironmentProxy() {
    return new Proxy(MockREnvironment, {
        construct: async () =>  new MockREnvironment()
    }) as unknown as {
        new(): Promise<REnvironment>;
    };
}
