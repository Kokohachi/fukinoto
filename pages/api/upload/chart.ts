import * as speef from "sonolus-pjsekai-engine-extended";
import type { NextApiRequest, NextApiResponse } from "next";
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
import * as zlib from "zlib";
import type { USC } from "sonolus-pjsekai-engine-extended";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("request received")
  // get chartID and suffix from request
  const chartID = req.query.chartID as string;
  const suffix = req.query.suffix as string;
  const repo: RepoDesignation = {
    type: "dataset",
    name: process.env.NEXT_PUBLIC_HF_REPONAME || "",
  };
  const credentials: Credentials = {
    accessToken: process.env.NEXT_PUBLIC_HF_TOKEN || "",
  };

  // download chart from huggingface
  async function downloadChart() {
    const chart = await downloadFile({
      repo,
      path: `charts/${chartID}/${chartID}.${suffix}`,
      credentials: credentials,
    });
    if (suffix === "sus") {
      return await chart?.text();
    } else if (suffix == "usc") {
      return await chart?.text();
    } else {
      return await Buffer.from(
        (await chart?.arrayBuffer()) || new ArrayBuffer(0)
      );
    }
  }
  let levelData = {} as any;
  let levelGzip = {} as Buffer;

  downloadChart().then((chart) => {
    if (suffix == "sus") {
      const usc = speef.susToUSC(chart as string);
      levelData = speef.uscToLevelData(usc);
      levelGzip = zlib.gzipSync(Buffer.from(JSON.stringify(levelData)));
    } else if (suffix == "chs") {
      const usc = speef.chsToUSC(chart as Buffer);
      levelData = speef.uscToLevelData(usc);
      levelGzip = zlib.gzipSync(Buffer.from(JSON.stringify(levelData)));
    } else if (suffix == "mmws") {
      const usc = speef.mmwsToUSC(chart as Buffer);
      levelData = speef.uscToLevelData(usc);
      levelGzip = zlib.gzipSync(Buffer.from(JSON.stringify(levelData)));
    } else if (suffix == "usc") {
      const usc = { ...JSON.parse(chart as string) } as USC;
      levelData = speef.uscToLevelData(usc);
      levelGzip = zlib.gzipSync(Buffer.from(JSON.stringify(levelData)));
    }
    // upload chart to huggingface
    async function uploadChart() {
        await uploadFiles({
            repo,
            credentials,
            files: [
                {
                    path: `charts/${chartID}/${chartID}.json.gz`,
                    content: new Blob([levelGzip]),
                },
                {
                    path: `charts/${chartID}/${chartID}.json`,
                    content: new Blob([JSON.stringify(levelData)]),
                },
            ],
        });
        }
    uploadChart().then(() => {
        return res.status(200).json({status: "success"})
        });
  });
}
