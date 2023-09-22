import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { supabaseGetChart } from "@/hooks/supabase/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  type LevelItem = {
    name: string;
    version: 1;
    rating: number;
    title: string;
    artists: string;
    author: string;
    engine: {};
    useSkin: {};
    useBackground: {};
    useEffect: {};
    useParticle: {};
    cover: {};
    bgm: {};
    preview?: {};
    data: {};
  };
  //get id (this file is [id].ts)])
  const returnest = {
    item: {} as LevelItem,
    description: "",
    reccomended: [],
  };
  const id = (req.query.id as string).split("fknt-")[1];
  if (!id) {
    res.status(400).send("Missing chart ID");
    return;
  }
  supabaseGetChart(id).then((charts) => {
    const chart = charts[0];
    if (!chart) {
      res.status(404).send("Chart not found");
      return;
    }
    if (typeof chart == "undefined") {
        res.status(404).send("Chart not found");
        return;
    }
    console.log(chart);
    const item: LevelItem = {
      name: "fknt-" + chart.id,
      version: 1,
      rating: chart.difficulty,
      title: chart.title,
      artists: chart.artist,
      author: chart.author + "@" + chart.author_id,
      engine: {
        author: "Nanashi. (Forked from Burrito)",
        background: {
          name: "fknt-pjsekai",
          version: 2,
          title: "Live",
          subtitle: "プロジェクトセカイ カラフルステージ!",
          author: "Burrito",
          thumbnail: {
            hash: "bc97c960f8cb509ed17ebfe7f15bf2a089a98b90",
            url: "https://cc.sevenc7c.com/sonolus/assets/backgrounds/BackgroundThumbnail",
            type: "BackgroundThumbnail",
          },
          data: {
            hash: "5e32e7fc235b0952da1b7aa0a03e7745e1a7b3d2",
            url: "https://cc.sevenc7c.com/sonolus/assets/backgrounds/BackgroundData",
            type: "BackgroundData",
          },
          image: {
            hash: "8dd5a1d679ffdd22d109fca9ccef37272a4fc5db",
            url: "https://cc.sevenc7c.com/sonolus/assets/backgrounds/BackgroundImage",
            type: "BackgroundImage",
          },
          configuration: {
            hash: "b0cddc8d80298a6d10fa8db560dcf35439495a02",
            url: "https://cc.sevenc7c.com/sonolus/assets/backgrounds/BackgroundConfiguration",
            type: "BackgroundConfiguration",
          },
        },
        configuration: {
          "hash": "673cf058eae71f76b4aed0ec85e71ade7f1a9161",
          "url": "/sonolus/assets/engines/EngineConfiguration",
          "type": "EngineConfiguration"
      },
        playData: {
          hash: "f084d8c08089081710204f6076b3a6265b1bac06",
          url: "https://cc.sevenc7c.com/sonolus/assets/engines/EnginePlayData",
          type: "EnginePlayData",
        },
        tutorialData: {
          hash: "3faa75b305cc4e0acf0468fb326852f14026bfe7",
          url: "https://cc.sevenc7c.com/sonolus/assets/engines/EngineTutorialData",
          type: "EngineTutorialData",
        },
        previewData: {
          hash: "363433ea3d8c81d2356556872154f261791543db",
          url: "https://cc.sevenc7c.com/sonolus/assets/engines/EnginePreviewData",
          type: "EnginePreviewData",
        },
        name: "fknt-pjsekai-extended",
        particle: {
          author: "Sonolus",
          data: {
            hash: "3d6c06680612cb880c8552672ac2999cfaeb49a8",
            url: "https://cc.sevenc7c.com/sonolus/assets/particles/ParticleData",
            type: "ParticleData",
          },
          name: "fknt-pjsekai",
          subtitle: "From servers.sonolus.com/pjsekai",
          description: "Nothing changed.",
          texture: {
            hash: "57b4bd504f814150dea87b41f39c2c7a63f29518",
            url: "https://cc.sevenc7c.com/sonolus/assets/particles/ParticleTexture",
            type: "ParticleTexture",
          },
          thumbnail: {
            hash: "e5f439916eac9bbd316276e20aed999993653560",
            url: "https://cc.sevenc7c.com/sonolus/assets/particles/ParticleThumbnail",
            type: "ParticleThumbnail",
          },
          title: "PJSekai",
          version: 2,
        },
        skin: {
          author: "Sonolus + Nanashi.",
          data: {
            hash: "6c088bb3b463728b4791d7a0a56784eafb2e79e6",
            url: "https://cc.sevenc7c.com/sonolus/assets/skins/SkinData",
            type: "SkinData",
          },
          name: "fknt-pjsekai-extended",
          subtitle: "PJSekai Extended",
          description: "PjSekai + Trace notes",
          texture: {
            hash: "20a964b06c77cee1cb381b6b90061d901f05e550",
            url: "https://cc.sevenc7c.com/sonolus/assets/skins/SkinTexture",
            type: "SkinTexture",
          },
          thumbnail: {
            hash: "24faf30cc2e0d0f51aeca3815ef523306b627289",
            url: "https://cc.sevenc7c.com/sonolus/assets/skins/SkinThumbnail",
            type: "SkinThumbnail",
          },
          title: "PJSekai+",
          version: 4,
        },
        effect: {
          audio: {
            hash: "63d6846cf0a1861b1d44bcae838a87afdcbf7985",
            url: "https://cc.sevenc7c.com/sonolus/assets/effects/EffectAudio",
            type: "EffectAudio",
          },
          author: "Sonolus",
          data: {
            hash: "46f29ad0e81c2ee9513dfe1254da37a3e085a0e4",
            url: "https://cc.sevenc7c.com/sonolus/assets/effects/EffectData",
            type: "EffectData",
          },
          name: "fknt-pjsekai-fixed",
          subtitle: "From servers.sonolus.com/pjsekai",
          description: "PJSekai + Trace notes",
          thumbnail: {
            hash: "e5f439916eac9bbd316276e20aed999993653560",
            url: "https://cc.sevenc7c.com/sonolus/assets/effects/EffectThumbnail",
            type: "EffectThumbnail",
          },
          title: "PJSekai",
          version: 5,
        },
        description: "PJSekai + Trace notes, custom judgement, etc.",
        subtitle: "From servers.sonolus.com/pjsekai",
        thumbnail: {
          hash: "e5f439916eac9bbd316276e20aed999993653560",
          url: "https://cc.sevenc7c.com/sonolus/assets/engines/EngineThumbnail",
          type: "EngineThumbnail",
        },
        title: "PJSekai+",
        version: 10,
      },
      cover: {
        hash: "",
        type: "LevelCover",
        url: `${process.env.NEXT_PUBLIC_HOST}api/charts/image?id=${chart.id}`,
      },
      bgm: {
        hash: "",
        type: "LevelBgm",
        url: `${process.env.NEXT_PUBLIC_HOST}api/charts/audio?id=${chart.id}`,
      },
      preview: {
        hash: "",
        type: "LevelPreview",
        url: `${process.env.NEXT_PUBLIC_HOST}api/charts/audio?id=${chart.id}`,
      },
      data: {
        hash: "",
        type: "LevelData",
        url: `${process.env.NEXT_PUBLIC_HOST}api/charts/data?id=${chart.id}`,
      },
      useSkin: {
        useDefault: true,
      },
      useBackground: {
        useDefault: true,
      },
      useParticle: {
        useDefault: true,
      },
      useEffect: {
        useDefault: true,
      },
    };
    returnest.item = item;
    returnest.description = chart.desc;
    res.status(200).json(returnest);
  });
}
