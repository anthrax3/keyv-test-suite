import delay from 'delay';

const keyvApiTests = (test, Keyv, store) => {
	test.beforeEach(async () => {
		const keyv = new Keyv({ store });
		await keyv.clear();
	});

	test.serial('.set(key, value) returns a Promise', t => {
		const keyv = new Keyv({ store });
		t.true(keyv.set('foo', 'bar') instanceof Promise);
	});

	test.serial('.set(key, value) resolves to value', async t => {
		const keyv = new Keyv({ store });
		t.is(await keyv.set('foo', 'bar'), 'bar');
	});

	test.serial('.set(key, value) sets a value', async t => {
		const keyv = new Keyv({ store });
		t.is(await keyv.set('foo', 'bar'), 'bar');
		t.is(await keyv.get('foo'), 'bar');
	});

	test.serial('.set(key, value, ttl) sets a value that expires', async t => {
		const keyv = new Keyv({ store });
		t.is(await keyv.set('foo', 'bar', 100), 'bar');
		t.is(await keyv.get('foo'), 'bar');
		await delay(110);
		t.is(await keyv.get('foo'), undefined);
	});

	test.serial('.get(key) returns a Promise', t => {
		const keyv = new Keyv({ store });
		t.true(keyv.get('foo') instanceof Promise);
	});

	test.serial('.get(key) resolves to value', async t => {
		const keyv = new Keyv({ store });
		await keyv.set('foo', 'bar');
		t.is(await keyv.get('foo'), 'bar');
	});

	test.serial('.get(key) with nonexistent key resolves to undefined', async t => {
		const keyv = new Keyv({ store });
		t.is(await keyv.get('foo'), undefined);
	});

	test.serial('.delete(key) returns a Promise', t => {
		const keyv = new Keyv({ store });
		t.true(keyv.delete('foo') instanceof Promise);
	});

	test.serial('.delete(key) resolves to true', async t => {
		const keyv = new Keyv({ store });
		await keyv.set('foo', 'bar');
		t.is(await keyv.delete('foo'), true);
	});

	test.serial('.delete(key) with nonexistent key resolves to false', async t => {
		const keyv = new Keyv({ store });
		t.is(await keyv.delete('foo'), false);
	});

	test.serial('.delete(key) deletes a key', async t => {
		const keyv = new Keyv({ store });
		await keyv.set('foo', 'bar');
		t.is(await keyv.delete('foo'), true);
		t.is(await keyv.get('foo'), undefined);
	});

	test.serial('.clear() returns a Promise', t => {
		const keyv = new Keyv({ store });
		t.true(keyv.clear() instanceof Promise);
	});

	test.serial('.clear() resolves to undefiend', async t => {
		const keyv = new Keyv({ store });
		t.is(await keyv.clear(), undefined);
		await keyv.set('foo', 'bar');
		t.is(await keyv.clear(), undefined);
	});

	test.serial('.clear() deletes all key/value pairs', async t => {
		const keyv = new Keyv({ store });
		await keyv.set('foo', 'bar');
		await keyv.set('fizz', 'buzz');
		await keyv.clear();
		t.is(await keyv.get('foo'), undefined);
		t.is(await keyv.get('fizz'), undefined);
	});

	test.serial('value can be false', async t => {
		const keyv = new Keyv({ store });
		await keyv.set('foo', false);
		t.is(await keyv.get('foo'), false);
	});

	test.serial('value can be null', async t => {
		const keyv = new Keyv({ store });
		await keyv.set('foo', null);
		t.is(await keyv.get('foo'), null);
	});

	test.serial('value can be undefined', async t => {
		const keyv = new Keyv({ store });
		await keyv.set('foo', undefined);
		t.is(await keyv.get('foo'), undefined);
	});

	test.serial('value can be a number', async t => {
		const keyv = new Keyv({ store });
		await keyv.set('foo', 0);
		t.is(await keyv.get('foo'), 0);
	});

	test.serial('value can be an object', async t => {
		const keyv = new Keyv({ store });
		const value = { fizz: 'buzz' };
		t.is(await keyv.set('foo', value), value);
		t.deepEqual(await keyv.get('foo'), value);
	});

	test.serial('value can be a buffer', async t => {
		const keyv = new Keyv({ store });
		const buf = Buffer.from('bar');
		await keyv.set('foo', buf);
		t.true(buf.equals(await keyv.get('foo')));
	});

	test.serial('value can be an object containing a buffer', async t => {
		const keyv = new Keyv({ store });
		const value = { buff: Buffer.from('buzz') };
		t.is(await keyv.set('foo', value), value);
		t.deepEqual(await keyv.get('foo'), value);
	});

	test.after.always(async () => {
		const keyv = new Keyv({ store });
		await keyv.clear();
	});
};

export default keyvApiTests;
