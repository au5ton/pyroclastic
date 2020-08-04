
import chalk from 'chalk'

export const info = function(...args: any){console.log(chalk.grey.apply(null, Array.from(arguments)))}
export const Info = function(...args: any){console.log(chalk.grey.bold.apply(null, Array.from(arguments)))}
export const error = function(...args: any){console.log(chalk.redBright.apply(null, Array.from(arguments)))}
export const success = function(...args: any){console.log(chalk.greenBright.bold.apply(null, Array.from(arguments)))}
export const bold = function(...args: any){console.log(chalk.bold.apply(null, Array.from(arguments)))}