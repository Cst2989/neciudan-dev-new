const _default = new Proxy({"src":"/_astro/default.e9d1d634.png","width":3000,"height":1364,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

export { _default as default };
