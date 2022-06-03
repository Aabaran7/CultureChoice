const gitCommitInfo = require('git-commit-info');

var info = gitCommitInfo();
console.log(info);