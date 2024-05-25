import axios from "axios";

import * as lark from "@larksuiteoapi/node-sdk";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import envService from "./EnvService";
import { Memo } from "../types";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Config {
  url: string[];
  request: {
    method: "GET" | "POST";
    getData: (memo: Memo) => {
      text: string;
      imageList: string[];
    };
    handleImage: (imageList: string[]) => Promise<any>;
  };
}

export class PushService {
  private configs: Record<string, Config> = {
    feishu: {
      url: envService.envs.FEISHU_URL.split(","),
      request: {
        method: "POST",
        getData: (memo: Memo) => {
          return {
            text: `${memo.content}
创建于: ${dayjs(memo.createTime)
              .tz("Asia/Shanghai")
              .format("YYYY-MM-DD HH:mm")}`,
            imageList: memo.resources.map(
              (res) => res.externalLink //`![${res.filename}](${res.externalLink})`
            ),
          };
        },
        handleImage: async (imageList: string[]) => {
          let imagesKey: string[] = [];
          for (let i = 0, l = imageList.length; i < l; i++) {
            const url = imageList[i];
            if (this.larkClient) {
              const response = await axios.get(url, {
                responseType: "arraybuffer",
              });
              const buffer = Buffer.from(response.data, "binary");
              const imageResult: any = await this.larkClient.im.image.create({
                data: {
                  image_type: "message",
                  image: buffer,
                },
              });
              imageResult &&
                imageResult.image_key &&
                imagesKey.push(imageResult.image_key);
            }
          }
          return imagesKey;
        },
      },
    },
  };

  private larkClient = new lark.Client({
    appId: envService.envs.FEISHU_APPID,
    appSecret: envService.envs.FEISHU_APP_SECRET,
    appType: lark.AppType.SelfBuild,
    domain: lark.Domain.Feishu,
  });

  push = (memo: Memo, prefix = "") => {
    Object.values(this.configs).forEach(async (config) => {
      console.log("发送内容为:");
      const data = config.request.getData(memo);
      const text = `${prefix}${data.text}`;

      if (data.imageList.length) {
        const imageKeys = await config.request.handleImage(data.imageList);
        config.url.forEach((url) => {
          axios({
            url: url,
            method: config.request.method,
            data: {
              msg_type: "post",
              content: {
                post: {
                  zh_cn: {
                    content: [
                      [
                        {
                          tag: "text",
                          text,
                        },
                      ],
                      imageKeys.map((image_key: string) => ({
                        tag: "img",
                        image_key,
                      })),
                    ],
                  },
                },
              },
            },
          });
        });
      } else {
        config.url.forEach((url) => {
          axios({
            url: url,
            method: config.request.method,
            data: {
              msg_type: "text",
              content: { text },
            },
          });
        });
      }
    });
  };
}
