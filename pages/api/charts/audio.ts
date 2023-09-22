import {
    createRepo,
    uploadFiles,
    deleteFile,
    deleteRepo,
    listFiles,
    whoAmI,
    downloadFile,
    } from "@huggingface/hub";
    import type { RepoDesignation, Credentials } from "@huggingface/hub";
    import { NextApiHandler } from "next/types";
    
    const repo: RepoDesignation = {
        type: "dataset",
        name: process.env.NEXT_PUBLIC_HF_REPONAME || "",
      };
      const credentials: Credentials = {
        accessToken: process.env.NEXT_PUBLIC_HF_TOKEN || "",
      };
    
    const getImage: NextApiHandler = async (req, res) => {
        const chartID = req.query.id as string;
        if (!chartID) {
            res.status(400).send("Missing chart ID");
            return;
        }
          const image_data = await(await downloadFile({
              repo,
              credentials,
              path: `charts/${chartID}/${chartID}.mp3`,
          }))
    
          if (!image_data) {
              res.status(404).send("Image not found");
              return;
          }
          image_data.arrayBuffer().then((buffer) => {
              //content-type: image/png
              res.setHeader("content-type", "audio/mp3");
              //file name: chartID.mp3
                res.setHeader("content-disposition", `attachment; filename=${chartID}.mp3`);
              res.status(200).send(Buffer.from(buffer));
          });
    }
    
    export default getImage;
    