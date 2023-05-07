import axios from "axios";
import { Memo } from "../types";
import envService from "./EnvService";

export class ApiService {
  private getMemoUrl = envService.envs.MEMOS_SERVER_URL;
  private successCode = 0;
  private openId = envService.envs.MEMOS_OPEN_API;
  private limit = 200;
  private offset = 0;

  /**
   * 给 params 排序以生成签名
   */
  private kSort(e: any) {
    var t = Object.keys(e).sort(),
      a: any = {};
    for (var n in t) a[t[n]] = e[t[n]];
    return a;
  }

  /**
   * 构造请求参数
   */
  private getParams() {
    const sortedParams: { [key: string]: string } = this.kSort({
      limit: this.limit,
      offset: this.offset * this.limit,
    });

    return { ...sortedParams, openId: this.openId };
  }

  private async request() {
    const resp = await axios.get(this.getMemoUrl, {
      params: this.getParams(),
    });
    const data = resp?.data;
    return (data?.data || []) as Memo[];
  }

  /**
   * 分片获取 memos
   */
  async getMemos(): Promise<Memo[]> {
    const memos = await this.request();
    if (memos.length >= this.limit) {
      this.offset += 1;
      return [...memos, ...(await this.getMemos())];
    } else {
      return memos;
    }
  }
}
