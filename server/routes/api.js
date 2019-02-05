const assert = require('assert');
const express = require('express');
const scraper = require('../scraper');
const { randomId } = require('../utils');
const { Workspace } = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/problem', (req, res) => {
  const type = req.query.type;
  const pid = req.query.id;
  if (!type || !pid)
    return res.status(400).send('Missing `type` or `id` parameter');

  scraper(type, pid)
    .then(value => res.json(value))
    .catch(e => res.status(400).send(e));
});

router.get('/workspace', async (req, res) => {
  const { ids } = req.query;
  if (typeof ids !== 'string')
    return res.status(400).send('Missing list of ids');
  const docs = await Workspace.find(
    { id: { $in: ids.split(',') } },
    'id updatedAt problem.title solution.language',
    { sort: { updatedAt: -1 } }
  );
  return res.json(docs);
});

router.post('/workspace', async (req, res) => {
  const type = req.body.type;
  const pid = req.body.id;
  if (!type || !pid)
    return res.status(400).send('Missing `type` or `id` parameter');

  let problem;
  try {
    problem = await scraper(type, pid);
  }
  catch (e) {
    return res.status(400).send(e)
  }
  const obj = new Workspace({ problem, id: await randomId() });
  await obj.save();
  return res.json(obj);
});

router.get('/workspace/:id', async (req, res) => {
  return res.json(await Workspace.findOne({ id: req.params.id }));
});

router.delete('/workspace/:id', async (req, res) => {
  return res.json(await Workspace.findOneAndDelete({ id: req.params.id }));
});

router.put('/workspace/:id/save', async (req, res) => {
  const obj = await Workspace.findOneAndUpdate({ id: req.params.id }, { solution: req.body }, { new: true });
  return res.json(obj);
});

module.exports = router;
