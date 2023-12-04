module.exports = {
  apps : [{
    name   : "the-ship",
    script : "./index.js",
    instances: 1,
    time: true,
    watch: true,
    ignore_watch : ["node_modules", ".git", ".gitignore", "ecosystem.config.js", "package.json", "package-lock.json", "README.md"],
  }]
}
