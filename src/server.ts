import application from './app/app';

const run = async () => {
    const port = 3000;
    const app = await application();

    app.listen(port);
    console.log(`Server has started on port ${port}`);
};

run();
