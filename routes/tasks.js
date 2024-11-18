const express = require('express');
const router = express.Router();

const { Op, fn, col } = require('sequelize');

const { Task, Type } = require('../models');

const filters = [
    {
        name: 'title',
        getQuery: value => ({[Op.substring]: value}),
    },
    {
        name: 'done',
        getQuery: value => ({[Op.eq]: value == "true"}),
        choices: ['true', 'false']
    },
    {
        name: 'late',
        getQuery: value => ({[value == "true" ? Op.lt : Op.gte]: fn('now')}),
        choices: ['true', 'false'],
        field: 'due_date',
    }
];

router.get('/', async (req, res) => {
    let { page = 1, limit = 5 } = req.query;

    const whereClauses = {};

    page = parseInt(page);
    limit = parseInt(limit);
    if(isNaN(page) || isNaN(limit) || page < 1){
        res.status(400);
        res.send("Pagination error");
        return;
    }

    for(let filter of filters){
        if(filter.name in req.query){
            const value = req.query[filter.name];
            if(filter.choices && !filter.choices.includes(value)){
                res.status(400)
                res.send(`Unexpected choice for filter '${filter.name}'`);
                return;
            }

            const field = filter.field || filter.name;
            whereClauses[field] = filter.getQuery(value);
        }
    }

    try {
        const { count, rows: tasks } = await Task.findAndCountAll({
            where: whereClauses,
            offset: (page - 1) * limit,
            limit: limit,
            include: Type,
            attributes: {exclude: ['TypeId']}
        });

        for(let task of tasks){
            await task.getType()
        }

        res.json({
            total: count,
            hasNext: (limit * page) < Math.max(count, limit),
            hasPrev: page > 1,
            results: tasks,
        });
    } catch (exception){
        console.error(exception);
        res.status(500);
        res.send("Unexpected error");
    }
});


router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const task = await Task.findByPk(id, {
            include: Type,
            attributes: {exclude: ['TypeId']}
        });
        if(!task){
            res.status(404);
            res.send(`No task with id '${id}'`);
            return;
        }

        res.json(task);
    } catch(err){
        res.status(500);
        console.error(err);
        res.send("Unexpected error");
        return;
    }
});


router.post('/', async (req, res) => {
    const {
        title,
        due_date,
        type: typeId,
        description = '',
        done = false,
    } = req.body;

    if(!title || !due_date){
        res.status(400);
        res.send("Title and due_date are mandatory");
        return;
    }

    if(isNaN(Date.parse(due_date))){
        res.status(400);
        res.send("Date format of field due_date not supported");
        return;
    }

    let type;
    if(typeId){
        type = await Type.findByPk(typeId);

        if(!type){
            res.status(404);
            res.send(`Type with id '${typeId}' not found`);
            return;
        }
    }


    try {
        const task = await Task.create({
            'title': title,
            'due_date': new Date(due_date),
            'typeId': type ? type.id : null,
            'description': description,
            'done': done
        }, {
            include: Type,
            attributes: {exclude: ['TypeId']}
        });
        res.status(201);
        res.json(task);
    } catch(err){
        res.status(500);
        res.send("Unexpected error");
    }
});

router.patch('/:id', async(req, res) => {
    const {
        title,
        due_date,
        type: typeId,
        description,
        done,
    } = req.body;

    const id = req.params.id;

    const task = await Task.findByPk(id);
    let type;

    if(!task){
        res.status(404)
        res.send(`No task with id '${id}'`);
        return;
    }

    let body = {
        'title': title,
        'due_date': due_date ? new Date(due_date) : undefined,
        'description': description,
        'done': done === undefined ? undefined : Boolean(done),
    };


    for(let key in body){
        if(body[key] === undefined){
            delete body[key];
        }
    }
    if(typeId){
        type = await Type.findByPk(typeId);
        if(!type){
            res.status(404);
            res.send(`No type with id '${typeId}'`);
            return;
        }
        body['TypeId'] = type.id;
    }

    try {
        task.set(body);
        await task.save();

        serializedTask = task.toJSON();
        if(task.TypeId){
            type = await task.getType();
            serializedTask.type = type.toJSON();
            delete serializedTask['TypeId'];
        }

        res.json(serializedTask);
    } catch(err){
        console.error("Error", err);
        res.status(500);
        res.send('Unexpected error');
    }
})

router.delete('/:id', async(req, res) => {
    const id = req.params.id;

    const task = await Task.findByPk(id);

    if(!task){
        res.status(404)
        res.send(`No task with id '${id}'`);
        return;
    }

    await task.destroy();
    res.status(204);
    res.send("Ok");
});


module.exports = router;