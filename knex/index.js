import knex from 'knex'
import config from '../knexfile.js'
import { types } from 'pg'

let cached = global.pg
if (!cached) cached = global.pg = {}

const DATE_OID = 1082;
const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID = 1114;
const INT4_OID = 23;
const INT8_OID = 20;
types.setTypeParser(DATE_OID, val => val);
types.setTypeParser(TIMESTAMPTZ_OID, val => val);
types.setTypeParser(TIMESTAMP_OID, val => val);
types.setTypeParser(INT4_OID, val => parseInt(val, 10));
types.setTypeParser(INT8_OID, val => parseInt(val, 10));

export function database() {
  if (!cached.instance) cached.instance = knex(config)
  return cached.instance
}
