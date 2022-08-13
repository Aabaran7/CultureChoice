# You can find the new timestamped tags here: https://hub.docker.com/r/gitpod/workspace-full/tags
FROM gitpod/workspace-full:2022-07-16-18-02-13


# Install custom tools, runtime, etc.
RUN brew install gh git-secret tig

