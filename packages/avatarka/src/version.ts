/** Version of the serialized avatar recipe and deterministic rendering protocol. */
export const RECIPE_VERSION = 1 as const;

export const RECIPE_PROTOCOL = `avatarka:${RECIPE_VERSION}` as const;
