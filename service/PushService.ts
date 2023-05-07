import axios from "axios";
import envService from "./EnvService";
import { Memo } from "../types";

interface Config {
  url: string;
  request: {
    method: "GET" | "POST";
    getData: (memo: Memo) => Memo;
  };
}

export class PushService {
  private configs: Record<string, Config> = {
    feishu: {
      url: envService.envs.FEISHU_URL,
      request: {
        method: "POST",
        getData: (memo: Memo) => ({
          title: "memos 每日提醒",
          ...memo,
        }),
      },
    },
  };

  push = (content: Memo) => {
    Object.values(this.configs).forEach((config) => {
      axios({
        url: config.url,
        method: config.request.method,
        data: {
          events: [config.request.getData(content)],
        },
      });
    });
  };
}
