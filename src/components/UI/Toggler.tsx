import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import type { Dispatch, FC } from 'react';

interface Props {
  on: boolean
  setOn: Dispatch<boolean>
  title: string
}

export const Toggle: FC<Props> = ({ on, setOn, title }) => {
  return (
    <div className='flex flex-row items-center'>
        <span className="mr-3 ml-5">{title}</span>
        <Switch
        checked={on}
        onChange={() => {
            setOn(!on);
        }}
        className={clsx(
            on ? 'bg-emerald-600' : 'bg-gray-600',
            'relative inline-flex h-4 w-8 items-center rounded-full'
        )}
        >
            <span
                aria-hidden="true"
                className={clsx(
                on ? 'translate-x-5' : 'translate-x-1',
                'nline-block h-2 w-2 transform rounded-full bg-white transition'
                )}
            />
        </Switch>
    </div>
  );
};