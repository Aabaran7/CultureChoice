# You can find the new timestamped tags here: https://hub.docker.com/r/gitpod/workspace-full/tags
FROM gitpod/workspace-full:2022-07-16-18-02-13


# Install custom tools, runtime, etc.
RUN brew install gh git-secret tig

## these are required for cypress
ENV CYPRESS_CACHE_FOLDER=/workspace/.cypress-cache
RUN sudo apt-get update \
    && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
        libgtk2.0-0 \
        libgtk-3-0 \
        libgbm-dev \
        libnotify-dev \
        libgconf-2-4 \
        libnss3 \
        libxss1 \
        libasound2 \
        libxtst6 \
        xauth \
        xvfb \
    && sudo apt-get clean \
    && rm -rf /var/lib/apt/lists/*
