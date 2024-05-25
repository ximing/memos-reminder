import axios from "axios";
import { Memo, MemosResponse } from "../types";
import envService from "./EnvService";

export class ApiService {
  private getMemoUrl = `${envService.envs.MEMOS_SERVER_URL}/api/v1/memos`;
  private accessToken = envService.envs.MEMOS_ACCESS_TOKEN;
  private successCode = 0;
  private pageSize = 200;
  private pageToken = "";

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
      pageSize: this.pageSize,
      pageToken: this.pageToken,
    });

    return { ...sortedParams };
  }

  private async request() {
    const resp = await axios.get<MemosResponse>(this.getMemoUrl, {
      params: this.getParams(),
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    if (envService.envs.DEBUG) {
      console.log("resp", resp);
    }
    const data = resp?.data;
    this.pageToken = data.nextPageToken || "";
    return data.memos;
  }

  /**
   * 分片获取 memos
   */
  async getMemos(): Promise<Memo[]> {
    const memos: Memo[] = [];
    do {
      const memosRes = await this.request();
      console.log("抓取数量", memosRes.length);
      memos.push(...memosRes);
    } while (this.pageToken);
    return memos;
  }
}
