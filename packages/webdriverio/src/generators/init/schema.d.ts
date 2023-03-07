import type {
  Framework,
  Protocol,
  Reporters,
  Runner,
  Services,
} from '../../wdio';

export interface Schema {
  runner?: Runner;
  framework?: Framework;
  reporters?: Reporters[];
  services?: Services[];
  protocol?: Protocol;
  skipFormat?: boolean;
}
