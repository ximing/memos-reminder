import axios from "axios";
import envService from "./EnvService";

interface Config {
  url: string;
  request: {
    method: "GET" | "POST";
    getData: (content: string) => Record<string, string | number>;
  };
}

export class PushService {
  private configs: Record<string, Config> = {
    feishu: {
      url: envService.envs.FEISHU_URL,
      request: {
        method: "POST",
        getData: (content) => ({
          id: Date.now(),
          title: "memos 每日提醒",
          content,
        }),
      },
    },
  };

  push = (content = "") => {
    Object.values(this.configs).forEach((config) => {
      axios({
        url: config.url,
        method: config.request.method,
        data: config.request.getData(content),
      });
    });
  };
}
