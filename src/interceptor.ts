import { info, error, success, bold } from './prettyPrint'
import { deobfuscate } from './deobfuscate'
import { Request } from 'puppeteer'
import { parse } from 'url'

declare const BentoStore: any;

export async function intercept(req: Request): Promise<void> {
  try {
    // https://bento.mheducation.com/files/smart-factory/###/smart-package/assessment-items/###.json
    const url = parse(req.url())
    if (url.hostname === 'bento.mheducation.com' && url.pathname?.includes('assessment-items')) {
      const res = await req.response()
      const bento: any = await res?.json()
      BentoStore[bento.id] = bento;
      legacyPresentAnswer(bento)
      console.log(req.url());
    }
  }
  catch (err) {
    error(err)
  }
}

export function legacyPresentAnswer(bento: any) {
  try {
    const payload = deobfuscate(bento.hidata.payload);

    info('=============================================');
    // console.groupCollapsed('debug info');
    // console.debug(bento.type);
    // console.debug(payload);
    // console.debug(bento);
    // console.groupEnd('debug info');
    //info('- - - - - - - - - - - - - - - - - - - - - - -');
    bold(payload.prompt)


    // Printing

    if (bento.type === 'MULTIPLE_CHOICE') {
      for (let choice of payload.choices) {
        if (choice.key === payload.answer) {
          console.log(`🔘 ${choice.content}`)
        }
        else {
          console.log(`⚪️ ${choice.content}`)
        }
      }
    }
    else if (bento.type === 'MULTIPLE_CHOICE_MULTI_SELECT') {
      for (let choice of payload.choices) {
        let flag = true;
        for (let ans of payload.answers) {
          if (choice.key === ans) {
            console.log(`✅ ${choice.content}`)
            flag = false;
          }
        }
        if (flag) {
          console.log(`⬜️ ${choice.content}`)
        }
      }
    }
    else if (bento.type === 'MATCHING') {
      let pairs: { [key: string]: any } = {};
      for (let ans of payload.answers) {
        pairs[ans.prompt] = ans.choices[0];
      }
      let table = [];
      for (let key of Object.keys(pairs)) {
        let Q;
        let A;
        for (let prompt of payload.prompts) {
          if (prompt.key === key) {
            Q = prompt.content;
          }
        }
        for (let choice of payload.choices) {
          if (choice.key === pairs[key]) {
            A = choice.content;
          }
        }
        table.push({ Q: Q, A: A });
      }
      console.table(table);
    }
    else if (bento.type === 'ORDERING') {
      let n = 1;
      for (let ans of payload.answers) {
        for (let choice of payload.choices) {
          if (choice.key === ans) {
            console.log(`#${n++}: ${choice.text}`)
            break;
          }
        }
      }
    }
    else if (bento.type === 'FILL_IN_THE_BLANK') {
      let n = 1;
      for (let ans of payload.answers) {
        console.log(`#${n++}: ${ans.values}`);
      }
    }
    else if (bento.type === 'TRUE_FALSE') {
      console.log(payload.answer === "true" ? '➕ True' : '➖ False');
    }
  }
  catch (err) {
    error(err);
  }

  info('=============================================');
}

//export function