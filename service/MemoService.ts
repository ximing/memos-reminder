// import { random } from "lodash";
import { Memo } from "../types";
import envService from "./EnvService";

const crypto = require("crypto");

function getRandomInt(min: number, max: number) {
  const randomBuffer = crypto.randomBytes(4);
  const randomInt = randomBuffer.readUInt32BE(0, true);
  // 将随机整数限制在[min, max)区间
  return (randomInt % (max - min)) + min;
}

export class MemoService {
  // private pushTags = envService.envs.PUSH_TAGS.split(",");

  private getMemo(memos: Memo[]) {
    return memos[getRandomInt(0, memos.length)];
    // return this.convertMemoToHtml(memos[random(memos.length - 1)]);
  }

  getLuckyMemo(memos: Memo[]) {
    // const tagMemos = memos.filter((memo) =>
    //   this.pushTags.some((tag) =>
    //     memo.tags.some((memoTag) => memoTag.includes(tag))
    //   )
    // );
    // if (tagMemos.length) {
    //   return this.getMemo(tagMemos);
    // }
    if (memos.length === 0) {
      return null;
    }
    return this.getMemo(memos);
  }

  getTodayMemo(memos: Memo[]) {
    const today = new Date();
    const todayMemos = memos.filter((memo) => {
      const date = new Date(memo.createdTs);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth()
      );
    });
    if (todayMemos.length == 0) {
      return null;
    }
    return this.getMemo(todayMemos);
  }
}
