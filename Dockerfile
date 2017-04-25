# Pull base image.
FROM centos

# Install RethinkDB.
RUN \
  curl http://download.rethinkdb.com/centos/7/`uname -m`/rethinkdb.repo -o /etc/yum.repos.d/rethinkdb.repo \
  && yum -y install rethinkdb

# Install Node.js
RUN \
  curl --silent --location https://rpm.nodesource.com/setup_6.x | bash - \
  && yum -y install nodejs

# Define mountable directories.
VOLUME ["/data"]

# Copy source
COPY . /data/xtv-collator/

# Define working directory.
WORKDIR /data

# Define default command.
CMD ["sh", "/data/xtv-collator/docker-start.sh"]

# Expose ports.
#   - 8080: rethinkDB web UI
#   - 3000: Node.js web app
EXPOSE 8080
EXPOSE 3000
