const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors());
app.use(koaBody({json: true}));

const notes = [];
let nextId = 1;

const router = new Router();

router.get('/notes', async (ctx, next) => {
    console.log('notes из ОТПРАВИТЬ []', notes);
    ctx.response.body = JSON.stringify(notes);
});

router.post('/notes', async (ctx, next) => {
    notes.push({...JSON.parse(ctx.request.body), id: nextId++});
    ctx.response.status = 204;
});

router.delete('/notes/:id', async (ctx, next) => {
    console.log('notes из УДАЛИТЬ JSON', ctx.params.id);

    const noteId = Number(ctx.params.id);
    const index = notes.findIndex(o => o.id === noteId);
    if (index !== -1) {
        notes.splice(index, 1);
    }
    ctx.response.body = JSON.stringify(notes); //
    console.log('ответ из делете', ctx.response.body);
    // ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));