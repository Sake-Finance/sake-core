  #!/bin/bash
  #tasks/misc/view-protocol-roles.ts: not sure why show in diff, just exclude it
git diff --name-only main aave-v3-deploy/main -- \
  ':!.gitignore' \
  ':!.github' \
  ':!.npmrc' \
  ':!CHANGELOG.md' \
  ':!tsconfig.json' \
  ':!tsconfig copy.json' \
  ':!Dockerfile' \
  ':!docker-compose.yml' \
  ':!LICENSE.md' \
  ':!README.md' \
  ':!package.json' \
  ':!package-lock.json' \
  ':!tasks/misc/view-protocol-roles.ts' \
  ':!contracts/core-v3' \
  ':!contracts/periphery-v3' > repo_diff_output.txt