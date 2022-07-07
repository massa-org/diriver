import { Constructor, Initializer, Provider, Ref } from './ref_base';
import { RefContainer } from './ref_container';
import { RefDispose } from './ref_dispose';
import { ResolveRef } from './ref_resolver';

export class GlobalRef implements Ref {
	private refDispose = new RefDispose();
	private refContainer = new RefContainer();

	async dispose() {
		await this.refDispose.dispose();
	}

	resolve<T>(constructor: Initializer<T>): Promise<T>;
	resolve<T>(constructor: Constructor<T>): T;

	resolve<T>(constructor: Provider<T>): T | Promise<T> {
		const ref = new ResolveRef(this.refContainer, this.refDispose);
		return ref.resolve(constructor);
	}
}
