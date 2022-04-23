<p  align="center">
<img  src="https://raw.githubusercontent.com/ahmetfaslantas/palette/master/client/public/logo192.png"/>
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

## Environment Variables

The following environment variables are set in the .env file (for backend):

- `PORT`: The port of the backend REST API.
- `DB`: The URI of the database.
- `SECRET`: The secret used to encrypt the JWT tokens.
- `UPLOAD_ROOT`: The root directory for uploads.
- `LOG_FILE`: The log file for all backend operations.
- `NODE_ENV`: The environment of the backend.

The following environment variables are set in the .env file (for frontend):

- `API_URL`: The URL of the backend REST API.

## Docker Deployment

### Prerequisities

In order to run this container you'll need docker installed.

- [Windows](https://docs.docker.com/windows/started)
- [OS X](https://docs.docker.com/mac/started/)
- [Linux](https://docs.docker.com/linux/started/)

### Installation

Starting the Docker containers are as simple as running the following command:

```bash
docker compose up
```

### Volumes

The following volumes are mounted to the containers:

- `db-volume`: The MongoDB volume.
- `files-volume`: The uploads volume.
- `api-logs`: The API logs volume.

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
