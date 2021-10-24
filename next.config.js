module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    // ignoreBuildErrors: process.env.DANGEROUSLY_DISREGARD_TYPES === "true",
    ignoreBuildErrors: true,
  },
}
