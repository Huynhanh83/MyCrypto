import { Action } from './types';

// Legacy
import buyIcon from 'common/assets/images/icn-buy.svg';
import swapIcon from 'common/assets/images/icn-swap.svg';
import sendIcon from 'common/assets/images/icn-send.svg';
import receiveIcon from 'common/assets/images/icn-receive.svg';
import hardwareWalletIcon from 'common/assets/images/icn-hardware-wallet.svg';

export const actions: Action[] = [
  {
    icon: buyIcon,
    title: 'Buy Assets',
    link: '/dashboard/buy'
  },
  {
    icon: swapIcon,
    title: 'Swap Assets',
    link: '/dashboard/swap'
  },
  {
    icon: sendIcon,
    title: 'Send Assets',
    link: '/dashboard/send'
  },
  {
    icon: receiveIcon,
    title: 'Request Assets',
    link: '/dashboard/request'
  },
  {
    icon: hardwareWalletIcon,
    title: 'Get_Hardware Wallet',
    link: '/dashboard/get-hardware-wallet'
  }
];