<p  align="center">
<img  src="https://i.imgur.com/620bgaf.png"/>
</p>

# Palette
A simple Open-Source Learning Management System built with the popular MERN stack.

## Features
The app is planned to include the following features: (More might be added in the future.)
- Student and Instructor account types.
- Creating courses, announcements and assignments.
- Enrolling students in specific courses.
- A similar Card based UI to Canvas.
- File upload and download for assignments and announcements.


## Docker Deployment
### Prerequisities
In order to run this container you'll need docker installed.

* [Windows](https://docs.docker.com/windows/started)
* [OS X](https://docs.docker.com/mac/started/)
* [Linux](https://docs.docker.com/linux/started/)

### Installation
Starting the Docker containers are as simple as running the following command:
```bash
docker compose up
```

### Volumes
The following volumes are mounted to the containers:
* `db-volume`: The MongoDB volume.
* `files-volume`: The uploads volume.

### Environment Variables
The following environment variables are set in the .env file:
* `PORT`: The port of the backend REST API.
* `DB`: The URI of the database.
* `SECRET`: The secret used to encrypt the JWT tokens.


## Development
To run the app locally you can use the following command:
```bash
npm run dev
```
This command will start the backend server and the frontend server.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)