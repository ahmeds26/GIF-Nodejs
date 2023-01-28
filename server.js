import React from "react";
import express from "express";
import fs from "fs";
import GIFEncoder from "gifencoder";
import { createCanvas, loadImage } from "canvas";


const app = express();
const port = process.env.PORT || 4000;

const width = 400;
const height = 400;

app.get('/generate-gif', (req, res) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const encoder = new GIFEncoder(width, height);
  encoder.createReadStream().pipe(fs.createWriteStream('./output/generated.gif'));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000);
  encoder.setQuality(10);

  const imgList = fs.readdirSync('./images/');
  imgList.forEach(async (f, i) => {
    const image = await loadImage(`./images/${f}`);
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    encoder.addFrame(ctx);
    if (i === imgList.length - 1) {
      encoder.finish();
      res.send({ message: 'GIF Generated!' });
    }
  });
});

app.listen(port, () => {
  console.log('Server started on: ' + port);
});
