FROM node:6

ADD /dist .

ENTRYPOINT ["node", "index.js"]