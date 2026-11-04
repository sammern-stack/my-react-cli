export const TYPES = ["component", "hook"] as const;
export const STYLES = ["css", "scss"] as const;

export const VALID_COMPONENT_NAME = /^[A-Z][a-zA-Z]*$/;
export const VALID_HOOK_NAME = /^use[A-Z][a-zA-Z]*$/;
