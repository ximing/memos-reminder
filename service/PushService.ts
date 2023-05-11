import axios from "axios";
import envService from "./EnvService";
import { Memo } from "../types";

interface Config {
  url: string;
  request: {
    method: "GET" | "POST";
    getData: (memo: Memo) => string;
  };
}

export class PushService {
  private configs: Record<string, Config> = {
    feishu: {
      url: envService.envs.FEISHU_URL,
      request: {
        method: "POST",
        getData: (memo: Memo) =>
          `${memo.content}\n${memo.resourceList.map(
            (res) => `![${res.filename}](${res.externalLink})`
          )}`,
      },
    },
  };

  push = (memo: Memo, prefix = "") => {
    Object.values(this.configs).forEach((config) => {
      console.log("发送内容为:");
      const content = `${prefix}${config.request.getData(memo)}`;
      axios({
        url: config.url,
        method: config.request.method,
        data: {
          content,
        },
      });
    });
  };
}
