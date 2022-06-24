import { METHODS } from 'http';
const methods = METHODS.map(m=>m.toLowerCase());
export type HttpMethod = typeof methods[number];
