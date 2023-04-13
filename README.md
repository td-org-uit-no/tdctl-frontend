
![Logo](https://raw.githubusercontent.com/td-org-uit-no/graphics/9fa70bc36f3d47e23f0961fe9dd5f1d0675db5a2/logo/logo-with-tagline/td-dark-tagline.svg)

# Website frontend

Welcome to the open-source repository for our website! We are excited to offer this opportunity to contribute to developing our online platform, which serves as a hub for student resources, news, and events. As a student-led organization, we believe in the power of collaboration and transparency. We invite all interested individuals to join our community and help us improve the website's functionality and design. By contributing to this project, you'll have the opportunity to showcase your technical skills, gain practical experience in web development, and make a meaningful impact on the student experience at our institution. We encourage you to explore the repository, share your ideas, and participate in community discussions. Together, we can build a website that truly reflects the needs and aspirations of our diverse student body. Thank you for your interest in our project, and we look forward to collaborating with you!

This is the repository for the frontend of our website. So if you want to contribute to our backend, please look at this [repository](https://github.com/td-org-uit-no/tdctl-api) instead.



## Tech Stack

We have chosen a tech stack that should make it easy for new students to learn the ropes and start contributing quickly.

**Client:** Docker, React


## Run Locally
> We prefer a containerized development. Therefore, the only dependeciy needed to work on this project is [docker/ docker-compose](https://docs.docker.com/get-docker/). To make this easier for new developers we have created a script that can be  used to run the api in a container locally, this script is placed in the project root and is called ```dev_utils.sh```.

> We currently do not have a development environment for our backend, so when working on our frontend you should pull our [backend repo](https://github.com/td-org-uit-no/tdctl-api) and run it locally. The frontend container will then automatically try to connect to your local backend.

1. Clone the project

```bash
    git clone git@github.com:td-org-uit-no/tdctl-frontend.git
```
2. Go to the project directory

```bash
    cd tdctl-frontend
```

3. Add executable rights to the container utils script
```bash
    chmod +x ./dev_utils
```

4. Build docker container
> This is only needed if it is the first time your running the project or if there has been any changes to the runtime environment of the website. 
```bash
    ./dev_utils compose build
```

1. Launch the container
    * Run container in background
        > Shutdown the container by running ```./dev_utils compose down```
        ```bash
            ./dev_utils compose up -d
        ```
        - You can now start a interactive shell within the container by running the command
            > To get an interactive shell in the database container add ```db``` to the end of this command
            ```bash
                ./dev_utils exec
            ```
    * Run the container and view container output
        > Shutdown the container by pressing ```ctrl-C```
        ```bash
            ./dev_utils compose up
        ```

When the container is up and running, you should be to view the website at [localhost:3000](http://localhost:3000)
    
## Missing Features?

Feel free to add issues to our [issue tracker](https://github.com/td-org-uit-no/tdctl-frontend/issues), or create your own  [pull request](#Contributing).
## Contributing

Contributions are always welcome!

See [`contributing.md`](./CONTRIBUTING.md) for ways to get started.

## Support

For support, email nettside-ansvarlig@td-uit.no

