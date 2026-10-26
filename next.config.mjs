/** @type {import('next').NextConfig} */
export default {
  outputFileTracingIncludes: { "/api/**": ["./db/schema.sql"] },
};
