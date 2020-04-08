
import atob from 'atob'

export function deobfuscate(t: Payload): any {
  if (t.length % 9 > 0 || t.match(/[^a-zA-Z0-9\/= +]/g)) throw new Error("Hidata payload does not match the interface");
  var n = t.replace(/(.)(.)(.)(.)(.)(.)(.)(.)(.)/g, "$2$6$8$1$4$9$3$5$7").replace(/ +$/, ""),
    r = b64DecodeUnicode(n);

  return JSON.parse(r)
}

export function b64DecodeUnicode(e: string): any {
  return decodeURIComponent(atob(e).split("").map(function (e: any) {
    return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2)
  }).join(""))
}

export type Payload = string

// JSON body from:
// https://bento.mheducation.com/files/smart-factory/###/smart-package/assessment-items/###.json
export interface Bento {
  id: string,
  learningObjective: {
    id: number,
    $path: string
  },
  type: 'MULTIPLE_CHOICE' | 'MULTIPLE_CHOICE_MULTI_SELECT' | 'MATCHING' | 'ORDERING' | 'FILL_IN_THE_BLANK' | 'TRUE_FALSE',
  hidata: {
    version: string,
    payload: Payload,
  },
  assets: {
    stem: any[],
    choices: any[]
  }
};