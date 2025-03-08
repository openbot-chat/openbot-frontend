import { NodeVM } from 'vm2';
import axios from 'axios';
import { Writable } from 'stream';

// 沙箱安全相关, 参考: https://www.anquanke.com/post/id/207283

interface IFuncExecuteService {
  execute(code: string, options?: Record<string, any>): Promise<any>;
}


class DefaultFuncExecuteService implements IFuncExecuteService {
  async execute(code: string, args: any[]): Promise<any> {
    const output = [];
    const stdoutStream = new Writable();
    stdoutStream.write = (chunk, encoding, callback?): boolean => {
      const date = new Date(); // TODO 不能每次都分配时间，要缓存
      if (output.length >= 1000) output.splice(0, 1);

      output.push({
        time: date,
        type: 'stdout',
        content: chunk,
      });

      return true;
    }

    const stderrStream = new Writable();
    stderrStream.write = (chunk, encoding, callback?): boolean => {
      const date = new Date();
      if (output.length >= 1000) output.splice(0, 1);

      output.push({
        time: date,
        type: 'stderr',
        content: chunk,
      });

      return true;
    }

    const logger = new console.Console(stdoutStream, stderrStream);

    const options = {
      sandbox: {
        axios,
        console: logger
      },
    };

    const _options = Object.assign({
      timeout: 5000,
      eval: false,
      require: {
        root: './',
        mock: {
          fs: {
            readFileSync() {
              return 'dummy!';
            },
          },
        },
      },
    }, options);

    const vm = new NodeVM(_options);

    const func: any =  await vm.run(code, 'node_modules') as T;
    try {
      await func(...args);
    } catch(e) {
      console.log('ee: ', e.message.split('\n'));
      e.message.split('\n').forEach(it => output.push({ time: new Date(), type: 'error', content: it }));
    }

    return {
      output,
    };
  }
}

const funcExecuteService = new DefaultFuncExecuteService();

export default funcExecuteService;