import { IWorker } from '../../ducks/providerBalancer/workers';
import { providerChannels } from '../channels';
import { makeWorker, makeWorkerId } from '../sagaUtils';
import { createWorker } from './helpers';
import { StrIdx } from '../../types';
import { Task } from 'redux-saga';
import { apply, spawn } from 'redux-saga/effects';

export function* spawnWorkers(
  providerId: string,
  currentWorkers: string[],
  maxNumOfWorkers: number
) {
  const providerChannel = yield apply(providerChannels, providerChannels.createChannel, [
    providerId
  ]);

  const workers: StrIdx<IWorker> = {};

  for (let workerNumber = currentWorkers.length; workerNumber < maxNumOfWorkers; workerNumber++) {
    const workerId = makeWorkerId(providerId, workerNumber);
    const workerTask: Task = yield spawn(createWorker, workerId, providerId, providerChannel);

    workers[workerId] = makeWorker(providerId, workerTask);
  }

  return { workers, workerIds: [...currentWorkers, ...Object.keys(workers)] };
}
