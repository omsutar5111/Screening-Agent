FROM ecr-public/docker/library/httpd:2.4
EXPOSE 8080
 
RUN echo "Copying build output"

COPY .htaccess /usr/local/apache2/htdocs/
COPY httpd.conf /usr/local/apache2/conf/
 
RUN mkdir /usr/local/apache2/dist/
COPY dist /usr/local/apache2/dist/

RUN echo "Installing NODE 20.17.0 output"
ENV NODE_VERSION=20.17.0
RUN apt-get update && apt-get -y install curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

STOPSIGNAL SIGTERM

CMD ["sh","-c","httpd && node /usr/local/apache2/dist/om-common-webuihrbotservice/server/server.mjs"]
