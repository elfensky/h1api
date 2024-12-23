# h1api

api cache, rebroadcaster and editor.

## Setup local environment

1. Install dependencies

```bash
npm i
```

2. Create a `.env` file in the root directory of the project and add the following variables:

```conf
# SQLITE EXAMPLE:
# DATABASE_URL="file:../db.sqlite"

# MYSQL EXAMPLE:
# host.docker.internal is a special hostname that resolves to the internal IP address of the host machine
# DATABASE_URL="mysql://user:password@host.docker.internal/database_name"
DATABASE_URL=your-database-url-here
```

3. Run `npm run dev` to start the api with nodemon, which will restart the bot on file changes
4. Run `npm run start` to start the api with node in production mode

## Docker

#### Build local

docker build -t elfensky/h1api:latest .

#### Build production

docker buildx build --platform linux/amd64 -t elfensky/h1api:latest . --push

#### Run in production

1. docker pull elfensky/h1api:latest
2. create an .env file with the same variables as above and note its path
3. create a docker-compose.yml file with the following content:

```yml
services:
    h1api:
        image: elfensky/h1api:latest # Replace with the correct image name and tag
        container_name: h1api # Optional: name your container
        env_file:
            - .env
        volumes:
            - /path/on/host:/app/data
        restart: unless-stopped # Automatically restart the container unless it is explicitly stopped
```

4. run `docker-compose up -d` to start the bot

#### Updates

1. `docker pull elfensky/h1bot:latest` to pull the latest version
2. `docker-compose up -d` to recreate and restart the container
