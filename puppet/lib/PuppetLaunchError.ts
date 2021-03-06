import { IPuppetLaunchError } from '@secret-agent/puppet-interfaces/IPuppetLaunchError';

export default class PuppetLaunchError extends Error implements IPuppetLaunchError {
  constructor(message: string, stack: string, readonly isSandboxError: boolean) {
    super(message);
    this.stack = stack;
  }
}
