import { container } from "tsyringe";

import { IDateProvider } from './DateProvider/IDateProvider';

import { DayjDateProvider } from './DateProvider/implementations/DayjsDateProvider';

container.registerSingleton<IDateProvider>(
  "DayjDateProvider",
  DayjDateProvider
);
