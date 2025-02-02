const profile = new Proxy({"src":"/_astro/profile.80fb31e2.png","width":1100,"height":1102,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					});

export { profile as default };
