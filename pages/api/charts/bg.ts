import { generate } from "../../../node_modules/pjsekai-background-generator-pixi/dist/bg-gen.esm.js";

import { NextApiHandler } from "next/types";

const getImage: NextApiHandler = async (req, res) => {
    const id = req.query.id as string;
    if (!id) {
        res.status(400).send("Missing chart ID");
        return;
    }
    const image_data = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/charts/image?id=${id}`);
    const image = await image_data.blob();
    const bg = await generate(image);
    res.setHeader("content-type", "image/png");
    res.status(200).send(bg);
};

export default getImage;
