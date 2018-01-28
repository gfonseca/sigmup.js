FROM node:9
MAINTAINER Roger Russel <roger@rrussel.org>
ENV TERM=xterm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
  git \
  zip \
  unzip \
  curl \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

RUN rm -fR /usr/local/bin/yarn && npm install -g yarn

CMD npm run server || tail -f /dev/null
