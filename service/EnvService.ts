class EnvService {
  envs = {
    MEMOS_OPEN_API: process.env.MEMOS_OPEN_API || "", // momo jwt
    MEMOS_SERVER_URL: process.env.MEMOS_SERVER_URL || "", // push-deer token
    PUSH_TAGS: process.env.PUSH_TAGS || "", // 需要推送的 tags，用逗号分割
    FEISHU_URL: process.env.FEISHU_URL || "", // push-deer token
    FEISHU_APPID: process.env.FEISHU_APPID || "", // 飞书 appid
    FEISHU_APP_SECRET: process.env.FEISHU_APP_SECRET || "", // 飞书 app secret
  };

  requiredEnvs: (keyof typeof this.envs)[] = ["MEMOS_OPEN_API"];

  constructor() {
    const lackEnvs = (
      Object.keys(this.envs) as Array<keyof typeof this.envs>
    ).filter((key) => {
      if (!this.requiredEnvs.includes(key)) {
        return false;
      }
      return !this.envs[key];
    });

    if (lackEnvs.length) {
      throw new Error(`缺少环境变量 ${lackEnvs.join("、")}`);
    }
  }
}

const envService = new EnvService();

export default envService;
